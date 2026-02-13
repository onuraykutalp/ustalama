import { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '../src/index'

async function createAdminUser() {
  try {
    // Environment variables veya default değerler
    const email = process.env.ADMIN_EMAIL || 'admin@talepo.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin User'

    console.log('🔐 Creating admin user...')
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Name: ${name}`)

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Mevcut kullanıcıyı admin yap
      if (existingUser.role !== UserRole.ADMIN) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: UserRole.ADMIN },
        })
        console.log('✅ Existing user updated to ADMIN role')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📧 Email:', email)
        console.log('🔑 Password: (use existing password)')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      } else {
        console.log('⚠️  Admin user already exists with this email')
        console.log('📧 Email:', email)
      }
      return
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10)

    // Admin kullanıcı oluştur
    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('👤 Name:', name)
    console.log('🆔 User ID:', adminUser.id)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
    console.log('🌐 Admin Panel URL: http://localhost:3000/admin-secret-7x9k2m4p8q1w3e5r6t')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()

