const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Supprime toutes les catégories existantes
  await prisma.category.deleteMany()

  // Crée les nouvelles catégories
  const categories = [
    {
      name: 'Petit déjeuner',
      icon: '🍳',
    },
    {
      name: 'Déjeuner',
      icon: '🥗',
    },
    {
      name: 'Dîner',
      icon: '🍽️',
    },
    {
      name: 'Dessert',
      icon: '🍰',
    },
    {
      name: 'Snack',
      icon: '🥨',
    },
    {
      name: 'Boisson',
      icon: '🥤',
    },
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    })
  }

  console.log('Les catégories ont été créées avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 