import { prisma } from '@/lib/prisma'
import { PlanningForm } from './planning-form'
import { redirect } from 'next/navigation'

async function getRecipes() {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      title: 'asc'
    },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      prepTime: true,
      cookTime: true,
      servings: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })

  if (recipes.length === 0) {
    redirect('/recettes/nouvelle')
  }

  return recipes
}

export default async function NewPlanningPage() {
  const recipes = await getRecipes()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Planifier un repas</h1>
      <PlanningForm recipes={recipes} />
    </div>
  )
} 