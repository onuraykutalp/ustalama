import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Tek kategori getir
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          services: {
            include: {
              provider: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Kategori bulunamadı' },
          { status: 404 }
        )
      }

      return NextResponse.json({ data: category })
    }

    // Tüm kategorileri getir
    const hasServices = searchParams.get('hasServices') === 'true'

    let where: any = {}

    // Eğer hasServices=true ise, sadece en az bir service'e sahip kategorileri getir
    if (hasServices) {
      where = {
        services: {
          some: {},
        },
      }
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        services: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ data: categories })
  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Kategoriler alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

