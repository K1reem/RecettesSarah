import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { Recipe } from '@/types/recipe'

async function getLatestRecipes() {
  const recipes = await prisma.recipe.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      category: true
    }
  })
  return recipes
}

export default async function HomePage() {
  const latestRecipes = await getLatestRecipes()

  return (
    <div className="mx-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dernières recettes</h1>
      
      <div className="space-y-4">
        {latestRecipes.map((recipe: Recipe) => (
          <Card key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
