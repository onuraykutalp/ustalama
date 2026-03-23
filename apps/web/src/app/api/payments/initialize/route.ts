import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { callPaymentApi } from '@/lib/iyzico'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 })
    }

    const body = await request.json()
    const {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      amount,
      paymentType = 'BALANCE_DEPOSIT',
      installment = 1,
      saveCard = false,
      description,
    } = body

    if (!cardHolderName || !cardNumber || !expireMonth || !expireYear || !cvc || !amount) {
      return NextResponse.json({ error: 'Kart bilgileri ve tutar gereklidir' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId } })
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    const nameParts = (user.name || 'Ad Soyad').split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || 'Soyad'

    const result = await callPaymentApi('ustalama-initialize-payment.php', {
      userID: user.id,
      price: amount,
      paidPrice: amount,
      paymentType,
      installment,
      saveCard,
      description,
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      name: firstName,
      lastname: lastName,
      email: user.email,
      gsmNumber: user.phone || '+905000000000',
      address: 'Türkiye',
      city: 'Istanbul',
      country: 'Turkey',
      postalCode: '34000',
    })

    if (!result.status) {
      return NextResponse.json({ error: result.message || 'Ödeme başlatılamadı' }, { status: 400 })
    }

    return NextResponse.json({
      status: true,
      paymentID: result.paymentID,
      htmlContent: result.htmlContent,
    })
  } catch (error: any) {
    console.error('Payment initialize error:', error)
    return NextResponse.json({ error: 'Ödeme başlatılırken bir hata oluştu' }, { status: 500 })
  }
}
