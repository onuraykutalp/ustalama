import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function GET(request: NextRequest) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            services: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ data: categories })
  } catch (error: any) {
    console.error('Get admin categories error:', error)
    return NextResponse.json(
      { error: 'Kategoriler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const body = await request.json()
    const { name, slug, description, icon } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'İsim ve slug gereklidir' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        icon: icon || null
      }
    })

    return NextResponse.json({
      message: 'Kategori başarıyla oluşturuldu',
      data: category
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create admin category error:', error)
    return NextResponse.json(
      { error: 'Kategori oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

