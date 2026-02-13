import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const requestId = searchParams.get('requestId')

    const where: any = {}
    if (providerId) where.providerId = providerId
    if (requestId) where.requestId = requestId

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        request: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ data: reviews })
  } catch (error: any) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Değerlendirmeler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { requestId, providerId, rating, comment } = body

    if (!requestId || !providerId || !rating) {
      return NextResponse.json(
        { error: 'requestId, providerId ve rating gereklidir' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating 1-5 arasında olmalıdır' },
        { status: 400 }
      )
    }

    // Request'i kontrol et
    const requestData = await prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece customer değerlendirme yapabilir
    if (requestData.customerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Sadece talep sahibi değerlendirme yapabilir' },
        { status: 403 }
      )
    }

    // Talep tamamlanmış olmalı
    if (requestData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Sadece tamamlanmış talepler için değerlendirme yapılabilir' },
        { status: 400 }
      )
    }

    // Zaten değerlendirme var mı kontrol et
    const existingReview = await prisma.review.findUnique({
      where: { requestId },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Bu talep için zaten değerlendirme yapılmış' },
        { status: 409 }
      )
    }

    const review = await prisma.review.create({
      data: {
        requestId,
        userId: auth.userId,
        providerId,
        rating,
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        provider: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        request: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Provider rating'ini güncelle
    const providerReviews = await prisma.review.findMany({
      where: { providerId },
    })

    const averageRating =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) /
      providerReviews.length

    await prisma.providerProfile.update({
      where: { id: providerId },
      data: { rating: averageRating },
    })

    return NextResponse.json(
      {
        message: 'Değerlendirme başarıyla oluşturuldu',
        data: review,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Değerlendirme oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

