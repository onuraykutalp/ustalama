import { NextRequest } from 'next/server'
import { authenticateRequest as authenticateRequestShared } from '@talepo/api-server'

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  userEmail?: string
  userRole?: string
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; userEmail: string; userRole: string } | null> {
  const authHeader = request.headers.get('authorization')
  return authenticateRequestShared(authHeader)
}

