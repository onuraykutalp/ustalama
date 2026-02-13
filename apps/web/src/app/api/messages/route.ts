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

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('requestId')

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId parametresi gereklidir' },
        { status: 400 }
      )
    }

    // Request'in sahibi olduğunu kontrol et
    const requestData = await prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Customer veya Provider olmalı
    const isAuthorized =
      requestData.customerId === auth.userId ||
      (requestData.providerId &&
        (await prisma.providerProfile.findFirst({
          where: {
            id: requestData.providerId,
            userId: auth.userId,
          },
        })))

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Bu mesajları görüntüleme yetkiniz yok' },
        { status: 403 }
      )
    }

    const messages = await prisma.message.findMany({
      where: { requestId },
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
    })

    return NextResponse.json({ data: messages })
  } catch (error: any) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Mesajlar alınırken bir hata oluştu' },
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
    const { requestId, content } = body

    if (!requestId || !content) {
      return NextResponse.json(
        { error: 'requestId ve content gereklidir' },
        { status: 400 }
      )
    }

    // Request'i bul ve yetki kontrolü
    const requestData = await prisma.request.findUnique({
      where: { id: requestId },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Talep bulunamadı' },
        { status: 404 }
      )
    }

    // Customer veya Provider olmalı
    const isAuthorized =
      requestData.customerId === auth.userId ||
      (requestData.providerId &&
        (await prisma.providerProfile.findFirst({
          where: {
            id: requestData.providerId,
            userId: auth.userId,
          },
        })))

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Bu talebe mesaj gönderme yetkiniz yok' },
        { status: 403 }
      )
    }

    const message = await prisma.message.create({
      data: {
        requestId,
        senderId: auth.userId,
        content,
      },
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
    })

    return NextResponse.json(
      {
        message: 'Mesaj başarıyla gönderildi',
        data: message,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Mesaj gönderilirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

