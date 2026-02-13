import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rating, comment } = body

    const review = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Değerlendirme bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece değerlendirme sahibi güncelleyebilir
    if (review.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Bu değerlendirmeyi güncelleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating 1-5 arasında olmalıdır' },
          { status: 400 }
        )
      }
      updateData.rating = rating
    }
    if (comment !== undefined) updateData.comment = comment

    const updatedReview = await prisma.review.update({
      where: { id: params.id },
      data: updateData,
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

    // Provider rating'ini yeniden hesapla
    const providerReviews = await prisma.review.findMany({
      where: { providerId: review.providerId },
    })

    const averageRating =
      providerReviews.reduce((sum, r) => sum + r.rating, 0) /
      providerReviews.length

    await prisma.providerProfile.update({
      where: { id: review.providerId },
      data: { rating: averageRating },
    })

    return NextResponse.json({
      message: 'Değerlendirme başarıyla güncellendi',
      data: updatedReview,
    })
  } catch (error: any) {
    console.error('Update review error:', error)
    return NextResponse.json(
      { error: 'Değerlendirme güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const review = await prisma.review.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Değerlendirme bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece değerlendirme sahibi silebilir
    if (review.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Bu değerlendirmeyi silme yetkiniz yok' },
        { status: 403 }
      )
    }

    const providerId = review.providerId

    await prisma.review.delete({
      where: { id: resolvedParams.id },
    })

    // Provider rating'ini yeniden hesapla
    const providerReviews = await prisma.review.findMany({
      where: { providerId },
    })

    const averageRating =
      providerReviews.length > 0
        ? providerReviews.reduce((sum, r) => sum + r.rating, 0) /
          providerReviews.length
        : 0

    await prisma.providerProfile.update({
      where: { id: providerId },
      data: { rating: averageRating },
    })

    return NextResponse.json({
      message: 'Değerlendirme başarıyla silindi',
    })
  } catch (error: any) {
    console.error('Delete review error:', error)
    return NextResponse.json(
      { error: 'Değerlendirme silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

