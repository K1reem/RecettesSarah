import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Petit déjeuner', icon: '☀️' },
    { name: 'Déjeuner', icon: '🍽️' },
    { name: 'Goûter', icon: '🍪' },
    { name: 'Dîner', icon: '🌙' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: 1 },
      update: { name: category.name, icon: category.icon },
      create: category,
    })
  }

  console.log('Base de données initialisée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 