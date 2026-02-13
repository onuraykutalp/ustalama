import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'
import { RequestStatus } from '@talepo/database'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)
    const body = await request.json()
    const { status, providerId } = body

    const updateData: any = {}
    if (status !== undefined) {
      updateData.status = status as RequestStatus
      if (status === RequestStatus.COMPLETED) {
        updateData.completedAt = new Date()
      }
    }
    if (providerId !== undefined) {
      updateData.providerId = providerId
    }

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
            email: true
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
        }
      }
    })

    return NextResponse.json({
      message: 'Talep başarıyla güncellendi',
      data: updatedRequest
    })
  } catch (error: any) {
    console.error('Update admin request error:', error)
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
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)

    await prisma.request.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      message: 'Talep başarıyla silindi'
    })
  } catch (error: any) {
    console.error('Delete admin request error:', error)
    return NextResponse.json(
      { error: 'Talep silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

