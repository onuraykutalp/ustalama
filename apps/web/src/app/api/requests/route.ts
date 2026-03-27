import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { RequestStatus } from '@talepo/database'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const providerId = searchParams.get('providerId')
    const status = searchParams.get('status')
    const opportunities = searchParams.get('opportunities') === 'true' // Provider olmayan talepler

    const where: any = {}
    if (customerId) where.customerId = customerId
    if (providerId) {
      // providerId parametresi providerProfile.userId olabilir
      // Önce providerProfile'ı bul
      const providerProfile = await prisma.providerProfile.findFirst({
        where: { userId: providerId },
      })
      if (providerProfile) {
        where.providerId = providerProfile.id
      } else {
        where.providerId = providerId
      }
    }
    if (status) where.status = status as RequestStatus
    if (opportunities) where.providerId = null

    const requests = await prisma.request.findMany({
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
        provider: {
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
        },
        service: {
          include: {
            category: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ data: requests })
  } catch (error: any) {
    console.error('Get requests error:', error)
    return NextResponse.json(
      { error: 'Talepler alınırken bir hata oluştu' },
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
    const { serviceId, categoryId, title, description, budget, location } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Başlık ve açıklama gereklidir' },
        { status: 400 }
      )
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Hizmet kategorisi seçilmelidir' },
        { status: 400 }
      )
    }

    const requestData = await prisma.request.create({
      data: {
        customerId: auth.userId,
        serviceId: serviceId || null,
        categoryId: categoryId || null,
        title,
        description,
        budget: budget || null,
        location: location || null,
        status: RequestStatus.PENDING,
      },
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
      },
    })

    return NextResponse.json(
      {
        message: 'Talep başarıyla oluşturuldu',
        data: requestData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create request error:', error)
    return NextResponse.json(
      { error: 'Talep oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

