import { NextRequest, NextResponse } from 'next/server'
import { handleRegister } from '@talepo/api-server'
import { sendWelcomeEmail } from '@/lib/mail'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await handleRegister(body)

    // Hoşgeldin maili gönder (arka planda, hata olursa kayıt etkilenmesin)
    sendWelcomeEmail(result.user.email, result.user.name || '').catch((err) => {
      console.error('Welcome email error:', err)
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: error.error || 'Kayıt sırasında bir hata oluştu' },
      { status: error.status || 500 }
    )
  }
}

