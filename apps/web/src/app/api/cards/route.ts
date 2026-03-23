import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { callPaymentApi } from '@/lib/iyzico'

// Kayıtlı kartları listele
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const cards = await prisma.savedCard.findMany({
      where: { userId: auth.userId },
      select: {
        id: true,
        cardAlias: true,
        cardLast4: true,
        cardBrand: true,
        cardBankName: true,
        isDefault: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: cards })
  } catch (error: any) {
    console.error('List cards error:', error)
    return NextResponse.json({ error: 'Kartlar alınırken bir hata oluştu' }, { status: 500 })
  }
}

// Yeni kart ekle
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const body = await request.json()
    const { cardHolderName, cardNumber, expireMonth, expireYear, cardAlias } = body

    if (!cardHolderName || !cardNumber || !expireMonth || !expireYear) {
      return NextResponse.json({ error: 'Kart bilgileri gereklidir' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId } })
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const result = await callPaymentApi('ustalama-add-card.php', {
      userID: user.id,
      email: user.email,
      cardUserKey: user.cardUserKey || null,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cardAlias: cardAlias || 'Kartım',
    })

    if (!result.status) {
      return NextResponse.json({ error: result.message || 'Kart kaydedilemedi' }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Kart başarıyla kaydedildi',
      data: result.data,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Add card error:', error)
    return NextResponse.json({ error: 'Kart eklenirken bir hata oluştu' }, { status: 500 })
  }
}
