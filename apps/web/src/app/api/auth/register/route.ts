import { NextRequest, NextResponse } from 'next/server'
import { handleRegister } from '@talepo/api-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await handleRegister(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: error.error || 'Kayıt sırasında bir hata oluştu' },
      { status: error.status || 500 }
    )
  }
}

