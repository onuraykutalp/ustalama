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
    const { name, slug, description, icon } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (icon !== undefined) updateData.icon = icon

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Güncellenecek alan belirtilmedi' },
        { status: 400 }
      )
    }

    const updatedCategory = await prisma.category.update({
      where: { id: resolvedParams.id },
      data: updateData
    })

    return NextResponse.json({
      message: 'Kategori başarıyla güncellendi',
      data: updatedCategory
    })
  } catch (error: any) {
    console.error('Update admin category error:', error)
    return NextResponse.json(
      { error: 'Kategori güncellenirken bir hata oluştu' },
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

    await prisma.category.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({
      message: 'Kategori başarıyla silindi'
    })
  } catch (error: any) {
    console.error('Delete admin category error:', error)
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

