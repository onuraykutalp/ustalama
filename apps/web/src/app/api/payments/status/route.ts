import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/middleware'
import { callPaymentApi } from '@/lib/iyzico'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const body = await request.json()
    const { paymentID } = body

    if (!paymentID) {
      return NextResponse.json({ error: 'paymentID gerekli' }, { status: 400 })
    }

    const result = await callPaymentApi('ustalama-listen.php', { paymentID })

    return NextResponse.json({ data: result })
  } catch (error: any) {
    console.error('Payment status error:', error)
    return NextResponse.json({ error: 'Ödeme durumu alınırken bir hata oluştu' }, { status: 500 })
  }
}
