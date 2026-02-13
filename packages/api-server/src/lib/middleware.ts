import { verifyToken } from './auth'

export interface AuthResult {
  userId: string
  userEmail: string
  userRole: string
}

export function authenticateRequest(
  authHeader: string | null
): AuthResult | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload) {
    return null
  }

  return {
    userId: payload.userId,
    userEmail: payload.email,
    userRole: payload.role,
  }
}

