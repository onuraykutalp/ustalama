import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed data buraya eklenecek
  console.log('Seeding database...')
  
  // Örnek kategori oluştur
  const category = await prisma.category.upsert({
    where: { slug: 'temizlik' },
    update: {},
    create: {
      name: 'Temizlik',
      slug: 'temizlik',
      description: 'Ev ve ofis temizlik hizmetleri',
    },
  })

  console.log('Created category:', category)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

