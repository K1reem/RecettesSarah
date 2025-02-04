import { prisma } from '@/lib/prisma'
import { RecipeForm } from './recipe-form'

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

export default async function NewRecipePage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouvelle recette</h1>
        <RecipeForm categories={categories} />
      </div>
    </div>
  )
} 