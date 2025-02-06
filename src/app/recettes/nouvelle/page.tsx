import { prisma } from '@/lib/prisma'
import { PageTitle } from '@/components/ui/page-title'
import { RecipeForm } from '@/components/ui/recipe-form'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function NewRecipePage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-4">
      <PageTitle showBack>Nouvelle recette</PageTitle>
      <RecipeForm categories={categories} mode="create" />
    </div>
  )
} 