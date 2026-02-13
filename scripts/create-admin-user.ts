import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@talepo.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Admin User'

    console.log('Creating admin user...')
    console.log(`Email: ${email}`)
    console.log(`Name: ${name}`)

    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      // Update existing user to admin role
      if (existingUser.role !== UserRole.ADMIN) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: UserRole.ADMIN },
        })
        console.log('✅ Existing user updated to ADMIN role')
      } else {
        console.log('⚠️  Admin user already exists with this email')
      }
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
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
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()

