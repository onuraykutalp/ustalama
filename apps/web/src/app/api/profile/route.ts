import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: {
        providerProfile: {
          include: {
            services: {
              include: {
                category: true,
              },
            },
            requests: true,
            reviews: {
              include: {
                user: true,
                request: true,
              },
            },
          },
        },
        customerRequests: {
          include: {
            provider: {
              include: {
                user: true,
              },
            },
            service: true,
            messages: true,
            reviews: true,
          },
        },
        reviews: {
          include: {
            provider: {
              include: {
                user: true,
              },
            },
            request: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      data: userWithoutPassword,
    })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Profil bilgileri alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, avatar } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (avatar !== undefined) updateData.avatar = avatar

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: updateData,
      include: {
        providerProfile: true,
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Profil başarıyla güncellendi',
      data: userWithoutPassword,
    })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Profil güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

