import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}
    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              customerRequests: true,
              reviews: true,
              messages: true
            }
          },
          providerProfile: {
            select: {
              id: true,
              isVerified: true,
              rating: true,
              totalJobs: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Get admin users error:', error)
    return NextResponse.json(
      { error: 'Kullanıcılar alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

