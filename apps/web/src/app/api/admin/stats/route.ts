import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    // Tüm istatistikleri topla
    const [
      totalUsers,
      totalProviders,
      totalCustomers,
      totalRequests,
      totalServices,
      totalCategories,
      totalReviews,
      totalMessages,
      pendingRequests,
      activeRequests,
      completedRequests,
      cancelledRequests
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'PROVIDER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.request.count(),
      prisma.service.count(),
      prisma.category.count(),
      prisma.review.count(),
      prisma.message.count(),
      prisma.request.count({ where: { status: 'PENDING' } }),
      prisma.request.count({ where: { status: { in: ['ACCEPTED', 'IN_PROGRESS'] } } }),
      prisma.request.count({ where: { status: 'COMPLETED' } }),
      prisma.request.count({ where: { status: 'CANCELLED' } })
    ])

    return NextResponse.json({
      data: {
        users: {
          total: totalUsers,
          providers: totalProviders,
          customers: totalCustomers,
          admins: totalUsers - totalProviders - totalCustomers
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          active: activeRequests,
          completed: completedRequests,
          cancelled: cancelledRequests
        },
        services: {
          total: totalServices
        },
        categories: {
          total: totalCategories
        },
        reviews: {
          total: totalReviews
        },
        messages: {
          total: totalMessages
        }
      }
    })
  } catch (error: any) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

