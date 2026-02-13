import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          provider: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          service: {
            include: {
              category: true
            }
          },
          _count: {
            select: {
              messages: true,
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
      prisma.request.count({ where })
    ])

    return NextResponse.json({
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Get admin requests error:', error)
    return NextResponse.json(
      { error: 'Talepler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

