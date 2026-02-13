import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from './middleware'

// Sadece belirli email adresine izin ver (opsiyonel ek güvenlik)
const ALLOWED_ADMIN_EMAIL = process.env.ADMIN_EMAIL || null

export async function requireAdmin(request: NextRequest) {
  const auth = await authenticateRequest(request)
  
  if (!auth) {
    return {
      error: NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      ),
      auth: null
    }
  }

  if (auth.userRole !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { error: 'Admin yetkisi gerekli' },
        { status: 403 }
      ),
      auth: null
    }
  }

  // Ek güvenlik: Sadece belirli email adresine izin ver (opsiyonel)
  if (ALLOWED_ADMIN_EMAIL && auth.userEmail !== ALLOWED_ADMIN_EMAIL) {
    return {
      error: NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      ),
      auth: null
    }
  }

  return {
    error: null,
    auth
  }
}

