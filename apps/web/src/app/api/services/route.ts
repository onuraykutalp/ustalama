import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { authenticateRequest } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const categoryId = searchParams.get('categoryId')
    const userId = searchParams.get('userId')

    const where: any = {}
    if (providerId) {
      where.providerId = providerId
    } else if (userId) {
      // userId ile provider profile'ı bul ve services'leri getir
      const providerProfile = await prisma.providerProfile.findUnique({
        where: { userId },
      })
      if (providerProfile) {
        where.providerId = providerProfile.id
      } else {
        // Provider profile yoksa boş array döndür
        return NextResponse.json({ data: [] })
      }
    }
    if (categoryId) where.categoryId = categoryId

    const services = await prisma.service.findMany({
      where,
      include: {
        provider: {
          include: {
            user: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ data: services })
  } catch (error: any) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Hizmetler alınırken bir hata oluştu' },
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
    const { categoryId, title, description, price, priceType } = body

    if (!categoryId || !title) {
      return NextResponse.json(
        { error: 'Kategori ve başlık gereklidir' },
        { status: 400 }
      )
    }

    // Provider profile'ı kontrol et
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: auth.userId },
    })

    if (!providerProfile) {
      return NextResponse.json(
        { error: 'Hizmet sağlayıcı profili bulunamadı' },
        { status: 404 }
      )
    }

    const service = await prisma.service.create({
      data: {
        providerId: providerProfile.id,
        categoryId,
        title,
        description: description || null,
        price: price || null,
        priceType: priceType || 'FIXED',
      },
      include: {
        category: true,
        provider: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Hizmet başarıyla oluşturuldu',
        data: service,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create service error:', error)
    return NextResponse.json(
      { error: 'Hizmet oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

