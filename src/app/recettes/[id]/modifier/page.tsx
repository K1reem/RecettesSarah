import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { PageTitle } from '@/components/ui/page-title'
import { RecipeForm } from './recipe-form'

async function getRecipe(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: parseInt(id) },
    include: {
      ingredients: true,
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  if (!recipe) {
    notFound()
  }

  return recipe
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const [recipe, categories] = await Promise.all([
    getRecipe(params.id),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-4">
      <PageTitle showBack>Modifier la recette</PageTitle>
      <RecipeForm recipe={recipe} categories={categories} />
    </div>
  )
} 