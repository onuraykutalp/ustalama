import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const service = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
      include: {
        provider: {
          include: {
            user: true,
          },
        },
        category: true,
        requests: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: service })
  } catch (error: any) {
    console.error('Get service error:', error)
    return NextResponse.json(
      { error: 'Hizmet alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const body = await request.json()
    const { title, description, price, priceType, categoryId } = body

    // Service'i bul ve sahibi kontrol et
    const service = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
      include: {
        provider: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 404 }
      )
    }

    if (!service.provider) {
      return NextResponse.json(
        { error: 'Hizmet sağlayıcı bilgisi bulunamadı' },
        { status: 404 }
      )
    }

    if (service.provider.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Bu hizmeti düzenleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = price
    if (priceType !== undefined) updateData.priceType = priceType
    if (categoryId !== undefined) updateData.categoryId = categoryId

    // Eğer güncellenecek bir alan yoksa hata döndür
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      )
    }

    const updatedService = await prisma.service.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        category: true,
        provider: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Hizmet başarıyla güncellendi',
      data: updatedService,
    })
  } catch (error: any) {
    console.error('Update service error:', error)
    return NextResponse.json(
      { error: 'Hizmet güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    // Service'i bul ve sahibi kontrol et
    const service = await prisma.service.findUnique({
      where: { id: resolvedParams.id },
      include: {
        provider: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Hizmet bulunamadı' },
        { status: 404 }
      )
    }

    if (!service.provider) {
      return NextResponse.json(
        { error: 'Hizmet sağlayıcı bilgisi bulunamadı' },
        { status: 404 }
      )
    }

    if (service.provider.userId !== auth.userId) {
      return NextResponse.json(
        { error: 'Bu hizmeti silme yetkiniz yok' },
        { status: 403 }
      )
    }

    await prisma.service.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({
      message: 'Hizmet başarıyla silindi',
    })
  } catch (error: any) {
    console.error('Delete service error:', error)
    return NextResponse.json(
      { error: 'Hizmet silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

