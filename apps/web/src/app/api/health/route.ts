import { NextResponse } from 'next/server'
import { prisma } from '@talepo/database'

export async function GET() {
  try {
    // Veritabanı bağlantısını test et
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

