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

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status') || RequestStatus.PENDING

    const where: any = {
      providerId: null, // Provider atanmamış talepler
      status: status as RequestStatus,
    }

    if (categoryId) {
      where.service = {
        categoryId,
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

