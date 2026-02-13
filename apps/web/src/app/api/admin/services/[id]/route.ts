import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'
import { requireAdmin } from '@/lib/adminMiddleware'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { error, auth } = await requireAdmin(request)
    if (error) return error

    const resolvedParams = await Promise.resolve(params)

    await prisma.service.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      message: 'Hizmet başarıyla silindi'
    })
  } catch (error: any) {
    console.error('Delete admin service error:', error)
    return NextResponse.json(
      { error: 'Hizmet silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

