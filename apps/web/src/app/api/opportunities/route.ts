import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { RequestStatus } from '@talepo/database'

// Opportunities = Provider olmayan talepler (Fırsatlar)
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    // Sadece PROVIDER'lar fırsatları görebilir
    if (auth.userRole !== 'PROVIDER') {
      return NextResponse.json(
        { error: 'Sadece hizmet sağlayıcılar fırsatları görebilir' },
        { status: 403 }
      )
    }

    // Provider profile'ı bul veya oluştur
    let providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: auth.userId },
      include: {
        services: {
          select: {
            categoryId: true,
          },
        },
      },
    })

    if (!providerProfile) {
      providerProfile = await prisma.providerProfile.create({
        data: {
          userId: auth.userId,
        },
        include: {
          services: {
            select: {
              categoryId: true,
            },
          },
        },
      })
    }

    // Provider'ın hizmet kategorilerini al
    const providerCategoryIds = providerProfile.services.map(service => service.categoryId)

    // Eğer provider'ın hiç hizmeti yoksa, boş array döndür
    if (providerCategoryIds.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status') || RequestStatus.PENDING

    const where: any = {
      providerId: null, // Provider atanmamış talepler
      status: status as RequestStatus,
      // Sadece provider'ın hizmet kategorilerindeki fırsatları göster
      categoryId: {
        in: providerCategoryIds,
      },
    }

    // Eğer özel bir kategori filtresi varsa, hem provider'ın kategorilerinde hem de seçilen kategoride olmalı
    if (categoryId) {
      if (providerCategoryIds.includes(categoryId)) {
        where.categoryId = categoryId
      } else {
        return NextResponse.json({ data: [] })
      }
    }

    const opportunities = await prisma.request.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        service: {
          include: {
            category: true,
          },
        },
        category: true,
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ data: opportunities })
  } catch (error: any) {
    console.error('Get opportunities error:', error)
    return NextResponse.json(
      { error: 'Fırsatlar alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

