import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer les catégories de base
  const categories = [
    { name: 'Entrées', icon: '🥗' },
    { name: 'Plats', icon: '🍽️' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Boissons', icon: '🥤' },
    { name: 'Apéritifs', icon: '🥨' },
    { name: 'Sauces', icon: '🥫' },
  ]

  console.log('Création des catégories...')
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log('Base de données initialisée !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 