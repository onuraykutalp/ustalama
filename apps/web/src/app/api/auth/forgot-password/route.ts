import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email adresi gereklidir' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Güvenlik: Kullanıcı bulunamasa bile aynı mesajı döndür
    if (!user) {
      return NextResponse.json({ message: 'Eğer bu email adresiyle bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.' })
    }

    // Token oluştur (32 byte hex)
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 saat

    // Token'ı veritabanına kaydet
    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    })

    // Mail gönder
    await sendPasswordResetEmail(user.email, user.name || '', resetToken)

    return NextResponse.json({ message: 'Eğer bu email adresiyle bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.' })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' }, { status: 500 })
  }
}
