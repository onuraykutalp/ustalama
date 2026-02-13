import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
      include: {
        providerProfile: {
          include: {
            services: true,
            requests: true,
            reviews: true
          }
        },
        customerRequests: {
          include: {
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
            service: true,
            messages: true,
            reviews: true
          }
        },
        reviews: {
          include: {
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
            request: true
          }
        },
        messages: {
          include: {
            request: true
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    const { password, ...userWithoutPassword } = user

    return NextResponse.json({ data: userWithoutPassword })
  } catch (error: any) {
    console.error('Get admin user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)
    const body = await request.json()
    const { name, email, phone, role, avatar } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (role !== undefined) updateData.role = role
    if (avatar !== undefined) updateData.avatar = avatar

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Kullanıcı başarıyla güncellendi',
      data: updatedUser
    })
  } catch (error: any) {
    console.error('Update admin user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken bir hata oluştu' },
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

    // Kendi hesabını silmeye çalışıyorsa engelle
    if (resolvedParams.id === auth!.userId) {
      return NextResponse.json(
        { error: 'Kendi hesabınızı silemezsiniz' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      message: 'Kullanıcı başarıyla silindi'
    })
  } catch (error: any) {
    console.error('Delete admin user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

