import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { RequestStatus } from '@talepo/database'

// Proposals = Provider'ın teklif verdiği talepler
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    // Provider profile'ı bul veya oluştur
    let providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!providerProfile) {
      providerProfile = await prisma.providerProfile.create({
        data: {
          userId: auth.userId,
        },
      })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {
      providerId: providerProfile.id,
    }

    if (status) {
      where.status = status as RequestStatus
    }

    const proposals = await prisma.request.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
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
            createdAt: 'desc',
          },
          take: 5, // Son 5 mesaj
        },
        reviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ data: proposals })
  } catch (error: any) {
    console.error('Get proposals error:', error)
    return NextResponse.json(
      { error: 'Teklifler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Provider bir talebe teklif verir (providerId atar)
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
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId gereklidir' },
        { status: 400 }
      )
    }

    // Provider profile'ı bul veya oluştur
    let providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!providerProfile) {
      providerProfile = await prisma.providerProfile.create({
        data: {
          userId: auth.userId,
        },
      })
    }

    // Request'i bul
    const requestData = await prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Zaten provider atanmış mı kontrol et
    if (requestData.providerId) {
      return NextResponse.json(
        { error: 'Bu talebe zaten bir hizmet sağlayıcı atanmış' },
        { status: 409 }
      )
    }

    // Teklif ver (providerId ata)
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        providerId: providerProfile.id,
        status: RequestStatus.ACCEPTED,
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
      },
    })

    return NextResponse.json(
      {
        message: 'Teklif başarıyla verildi',
        data: updatedRequest,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Create proposal error:', error)
    return NextResponse.json(
      { error: 'Teklif verilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

