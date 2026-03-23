import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { callPaymentApi } from '@/lib/iyzico'

// Kart sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const card = await prisma.savedCard.findFirst({
      where: { id: params.id, userId: auth.userId },
    })
    if (!card) {
      return NextResponse.json({ error: 'Kart bulunamadı' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId } })

    await callPaymentApi('ustalama-delete-card.php', {
      userID: auth.userId,
      cardId: params.id,
      cardUserKey: user?.cardUserKey || '',
    })

    return NextResponse.json({ message: 'Kart başarıyla silindi' })
  } catch (error: any) {
    console.error('Delete card error:', error)
    return NextResponse.json({ error: 'Kart silinirken bir hata oluştu' }, { status: 500 })
  }
}

// Varsayılan kart yap
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const card = await prisma.savedCard.findFirst({
      where: { id: params.id, userId: auth.userId },
    })
    if (!card) {
      return NextResponse.json({ error: 'Kart bulunamadı' }, { status: 404 })
    }

    await prisma.savedCard.updateMany({
      where: { userId: auth.userId },
      data: { isDefault: false },
    })

    await prisma.savedCard.update({
      where: { id: params.id },
      data: { isDefault: true },
    })

    return NextResponse.json({ message: 'Varsayılan kart güncellendi' })
  } catch (error: any) {
    console.error('Update default card error:', error)
    return NextResponse.json({ error: 'Kart güncellenirken bir hata oluştu' }, { status: 500 })
  }
}
