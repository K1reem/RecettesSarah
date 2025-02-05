import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Trouver la catégorie "Desserts"
  const dessertCategory = await prisma.category.findUnique({
    where: { name: 'Desserts' }
  })

  if (!dessertCategory) {
    throw new Error('Catégorie Desserts non trouvée')
  }

  console.log('Création de la tarte aux pommes...')

  const recipe = await prisma.recipe.create({
    data: {
      title: 'Tarte aux Pommes',
      categoryId: dessertCategory.id,
      prepTime: 30,
      cookTime: 45,
      servings: 8,
      ingredients: {
        create: [
          { name: 'Pâte brisée', amount: 1, unit: 'pièce' },
          { name: 'Pommes', amount: 6, unit: 'pièces' },
          { name: 'Sucre', amount: 100, unit: 'g' },
          { name: 'Cannelle', amount: 1, unit: 'cuillère à café' },
          { name: 'Beurre', amount: 50, unit: 'g' },
        ]
      },
      steps: {
        create: [
          {
            order: 1,
            description: 'Préchauffer le four à 180°C',
          },
          {
            order: 2,
            description: 'Étaler la pâte brisée dans un moule à tarte',
          },
          {
            order: 3,
            description: 'Éplucher et couper les pommes en fines tranches',
            timer: 15
          },
          {
            order: 4,
            description: 'Disposer les pommes en rosace sur la pâte',
          },
          {
            order: 5,
            description: 'Saupoudrer de sucre et de cannelle, répartir des petits morceaux de beurre',
          },
          {
            order: 6,
            description: 'Enfourner et cuire jusqu\'à ce que la tarte soit dorée',
            timer: 45
          }
        ]
      }
    },
    include: {
      category: true,
      ingredients: true,
      steps: true
    }
  })

  console.log('Recette créée avec succès !')
  console.log('Détails de la recette :', recipe)
}

main()
  .catch((e) => {
    console.error('Erreur :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 