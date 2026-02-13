import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await prisma.providerProfile.findUnique({
      where: { id: params.id },
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
        requests: {
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
            request: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Hizmet sağlayıcı bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: provider })
  } catch (error: any) {
    console.error('Get provider error:', error)
    return NextResponse.json(
      { error: 'Hizmet sağlayıcı alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bio, isVerified } = body

    // Provider'ı bul ve sahibi kontrol et
    const provider = await prisma.providerProfile.findUnique({
      where: { id: params.id },
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Hizmet sağlayıcı bulunamadı' },
        { status: 404 }
      )
    }

    if (provider.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Bu profili güncelleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (bio !== undefined) updateData.bio = bio
    // isVerified sadece admin tarafından değiştirilebilir, burada sadece bio güncellenebilir

    const updatedProvider = await prisma.providerProfile.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        services: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Profil başarıyla güncellendi',
      data: updatedProvider,
    })
  } catch (error: any) {
    console.error('Update provider error:', error)
    return NextResponse.json(
      { error: 'Profil güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

