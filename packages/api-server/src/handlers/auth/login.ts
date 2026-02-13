import { prisma } from '@talepo/database'
import { comparePassword, generateToken } from '../../lib/auth'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  user: any
  token: string
}

export async function handleLogin(data: LoginRequest): Promise<LoginResponse> {
  const { email, password } = data

  if (!email || !password) {
    throw { status: 400, error: 'Email ve şifre gereklidir' }
  }

  // Kullanıcıyı bul
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      providerProfile: true,
    },
  })

  if (!user) {
    throw { status: 401, error: 'Email veya şifre hatalı' }
  }

  // Şifreyi kontrol et
  const isPasswordValid = await comparePassword(password, user.password)
  if (!isPasswordValid) {
    throw { status: 401, error: 'Email veya şifre hatalı' }
  }

  // Token oluştur
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  })

  // Şifreyi response'dan çıkar
  const { password: _, ...userWithoutPassword } = user

  return {
    message: 'Giriş başarılı',
    user: userWithoutPassword,
    token,
  }
}

