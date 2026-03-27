import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token ve yeni şifre gereklidir' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır' }, { status: 400 })
    }

    // Token'ı kontrol et
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı. Lütfen yeni bir şifre sıfırlama talebi oluşturun.' }, { status: 400 })
    }

    // Şifreyi güncelle ve token'ı temizle
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({ message: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.' })
  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' }, { status: 500 })
  }
}
