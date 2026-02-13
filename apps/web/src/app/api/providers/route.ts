import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const verified = searchParams.get('verified')
    const premium = searchParams.get('premium') // Premium için ayrı endpoint olabilir

    const where: any = {}
    if (verified === 'true') where.isVerified = true

    const providers = await prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
        services: {
          include: {
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Son 5 değerlendirme
        },
      },
      orderBy: {
        rating: 'desc',
      },
    })

    return NextResponse.json({ data: providers })
  } catch (error: any) {
    console.error('Get providers error:', error)
    return NextResponse.json(
      { error: 'Hizmet sağlayıcılar alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

