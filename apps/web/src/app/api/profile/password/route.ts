import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { comparePassword, hashPassword } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Mevcut şifre ve yeni şifre gereklidir' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Yeni şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await comparePassword(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mevcut şifre hatalı' },
        { status: 401 }
      )
    }

    // Yeni şifreyi hashle ve güncelle
    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: auth.userId },
      data: { password: hashedPassword },
    })

    return NextResponse.json({
      message: 'Şifre başarıyla değiştirildi',
    })
  } catch (error: any) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Şifre değiştirilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

