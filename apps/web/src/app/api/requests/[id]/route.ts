import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'
import { RequestStatus } from '@talepo/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const auth = await authenticateRequest(request)
    const resolvedParams = await Promise.resolve(params)
    const requestData = await prisma.request.findUnique({
      where: { id: resolvedParams.id },
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
                phone: true,
              },
            },
          },
        },
        service: {
          include: {
            category: true,
          },
        },
        category: true,
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
            provider: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Yetki kontrolü: Customer kendi talebini, Provider ise tüm talepleri görebilir
    if (auth) {
      const isCustomer = requestData.customerId === auth.userId
      const isProvider = auth.userRole === 'PROVIDER'
      const isAdmin = auth.userRole === 'ADMIN'

      const canView = isCustomer || isProvider || isAdmin

      if (!canView) {
        return NextResponse.json(
          { error: 'Bu talebi görüntüleme yetkiniz yok' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ data: requestData })
  } catch (error: any) {
    console.error('Get request error:', error)
    return NextResponse.json(
      { error: 'Talep alınırken bir hata oluştu' },
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
    const { providerId, categoryId, status, title, description, budget, location } = body

    // Request'i bul
    const requestData = await prisma.request.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Yetki kontrolü: Customer kendi talebini, Provider ise kendi tekliflerini güncelleyebilir
    const isCustomer = requestData.customerId === auth.userId
    const isProvider = requestData.providerId === auth.userId && auth.userRole === 'PROVIDER'

    if (!isCustomer && !isProvider) {
      return NextResponse.json(
        { error: 'Bu talebi güncelleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const updateData: any = {}
    if (title !== undefined && isCustomer) updateData.title = title
    if (description !== undefined && isCustomer) updateData.description = description
    if (budget !== undefined && isCustomer) updateData.budget = budget
    if (location !== undefined && isCustomer) updateData.location = location
    if (categoryId !== undefined && isCustomer) updateData.categoryId = categoryId
    if (providerId !== undefined && isProvider) updateData.providerId = providerId
    if (status !== undefined) {
      // Status güncellemesi için yetki kontrolü
      if (isProvider || (isCustomer && status === RequestStatus.CANCELLED)) {
        updateData.status = status as RequestStatus
        if (status === RequestStatus.COMPLETED) {
          updateData.completedAt = new Date()
        }
      } else {
        return NextResponse.json(
          { error: 'Status güncelleme yetkiniz yok' },
          { status: 403 }
        )
      }
    }

    // Eğer güncellenecek bir alan yoksa hata döndür
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.request.update({
      where: { id: resolvedParams.id },
      data: updateData,
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
        category: true,
      },
    })

    return NextResponse.json({
      message: 'Talep başarıyla güncellendi',
      data: updatedRequest,
    })
  } catch (error: any) {
    console.error('Update request error:', error)
    return NextResponse.json(
      { error: 'Talep güncellenirken bir hata oluştu' },
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
    const requestData = await prisma.request.findUnique({
      where: { id: resolvedParams.id },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Sadece customer kendi talebini silebilir
    if (requestData.customerId !== auth.userId) {
      return NextResponse.json(
        { error: 'Bu talebi silme yetkiniz yok' },
        { status: 403 }
      )
    }

    await prisma.request.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({
      message: 'Talep başarıyla silindi',
    })
  } catch (error: any) {
    console.error('Delete request error:', error)
    return NextResponse.json(
      { error: 'Talep silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

