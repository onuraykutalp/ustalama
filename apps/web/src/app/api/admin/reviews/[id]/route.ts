import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)

    // Review'ı silmeden önce provider rating'ini güncelle
    const review = await prisma.review.findUnique({
      where: { id: resolvedParams.id },
      select: { providerId: true }
    })

    await prisma.review.delete({
      where: { id: resolvedParams.id }
    })

    // Provider rating'ini yeniden hesapla
    if (review) {
      const providerReviews = await prisma.review.findMany({
        where: { providerId: review.providerId }
      })

      const averageRating =
        providerReviews.length > 0
          ? providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length
          : 0

      await prisma.providerProfile.update({
        where: { id: review.providerId },
        data: { rating: averageRating }
      })
    }

    return NextResponse.json({
      message: 'Değerlendirme başarıyla silindi'
    })
  } catch (error: any) {
    console.error('Delete admin review error:', error)
    return NextResponse.json(
      { error: 'Değerlendirme silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

