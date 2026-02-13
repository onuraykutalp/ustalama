import { prisma } from '@talepo/database'
import { hashPassword, generateToken } from '../../lib/auth'
import { UserRole } from '@talepo/database'

export interface RegisterRequest {
  email: string
  password: string
  name?: string | null
  phone?: string | null
  role?: UserRole
}

export interface RegisterResponse {
  message: string
  user: any
  token: string
}

export async function handleRegister(data: RegisterRequest): Promise<RegisterResponse> {
  const { email, password, name, phone, role = UserRole.CUSTOMER } = data

  if (!email || !password) {
    throw { status: 400, error: 'Email ve şifre gereklidir' }
  }

  if (password.length < 6) {
    throw { status: 400, error: 'Şifre en az 6 karakter olmalıdır' }
  }

  // Email kontrolü
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw { status: 409, error: 'Bu email adresi zaten kullanılıyor' }
  }

  // Şifreyi hashle
  const hashedPassword = await hashPassword(password)

  // Kullanıcıyı oluştur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || null,
      phone: phone || null,
      role: role as UserRole,
    },
    include: {
      providerProfile: true,
    },
  })

  // Eğer PROVIDER ise ProviderProfile oluştur
  if (user.role === UserRole.PROVIDER) {
    await prisma.providerProfile.create({
      data: {
        userId: user.id,
      },
    })
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
    message: 'Kayıt başarılı',
    user: userWithoutPassword,
    token,
  }
}

