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
    const { cardId, amount, paymentType = 'BALANCE_DEPOSIT', description, installment = 1 } = body

    if (!cardId || !amount) {
      return NextResponse.json({ error: 'Kart ve tutar gereklidir' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId } })
    if (!user || !user.cardUserKey) {
      return NextResponse.json({ error: 'Kayıtlı kart bulunamadı' }, { status: 404 })
    }

    const savedCard = await prisma.savedCard.findFirst({
      where: { id: cardId, userId: auth.userId },
    })
    if (!savedCard) {
      return NextResponse.json({ error: 'Kart bulunamadı' }, { status: 404 })
    }

    const nameParts = (user.name || 'Ad Soyad').split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || 'Soyad'

    const result = await callPaymentApi('ustalama-initialize-payment-with-saved-card.php', {
      userID: user.id,
      cardUserKey: user.cardUserKey,
      cardToken: savedCard.cardToken,
      cardLast4: savedCard.cardLast4,
      price: amount,
      paidPrice: amount,
      paymentType,
      installment,
      description,
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
      return NextResponse.json({ error: result.message || 'Ödeme başarısız' }, { status: 400 })
    }

    return NextResponse.json({
      status: true,
      message: 'Ödeme başarılı',
      paymentID: result.paymentID,
    })
  } catch (error: any) {
    console.error('Saved card payment error:', error)
    return NextResponse.json({ error: 'Ödeme işlenirken bir hata oluştu' }, { status: 500 })
  }
}
