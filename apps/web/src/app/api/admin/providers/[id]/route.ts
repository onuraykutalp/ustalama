import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)
    const body = await request.json()
    const { isVerified, bio, rating, totalJobs } = body

    const updateData: any = {}
    if (isVerified !== undefined) updateData.isVerified = isVerified
    if (bio !== undefined) updateData.bio = bio
    if (rating !== undefined) updateData.rating = rating
    if (totalJobs !== undefined) updateData.totalJobs = totalJobs

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      )
    }

    const updatedProvider = await prisma.providerProfile.update({
      where: { id: resolvedParams.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Hizmet sağlayıcı başarıyla güncellendi',
      data: updatedProvider
    })
  } catch (error: any) {
    console.error('Update admin provider error:', error)
    return NextResponse.json(
      { error: 'Hizmet sağlayıcı güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

