import { NextRequest, NextResponse } from 'next/server'
import { handleLogin } from '@talepo/api-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await handleLogin(body)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error.error || 'Giriş yapılırken bir hata oluştu' },
      { status: error.status || 500 }
    )
  }
}

