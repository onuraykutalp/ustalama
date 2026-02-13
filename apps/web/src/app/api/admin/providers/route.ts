import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}
    if (verified !== null) {
      where.isVerified = verified === 'true'
    }

    const [providers, total] = await Promise.all([
      prisma.providerProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              services: true,
              requests: true,
              reviews: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.providerProfile.count({ where })
    ])

    return NextResponse.json({
      data: providers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Get admin providers error:', error)
    return NextResponse.json(
      { error: 'Hizmet sağlayıcılar alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

