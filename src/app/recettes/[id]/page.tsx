import { prisma } from '@/lib/prisma'
import { Clock, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { FavoriteButton, StartCookingButton } from '.'
import { PageTitle } from '@/components/ui/page-title'
import { RecipeImage } from '@/components/ui/recipe-image'
import { RecipeActions } from '@/components/ui/recipe-actions'
import { SectionTitle } from '@/components/ui/section-title'
import { Ingredient, Step } from '@/types/recipe'

async function getRecipe(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
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

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id)

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="space-y-3.5">
        <PageTitle 
          showBack 
          action={<FavoriteButton recipeId={recipe.id} isFavorite={recipe.isFavorite} />}
        >
          {recipe.title}
        </PageTitle>

        <StartCookingButton steps={recipe.steps} />

        <RecipeImage
          imageUrl={recipe.imageUrl}
          title={recipe.title}
        />

        <div className="bg-white rounded-lg shadow-sm p-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Temps total</p>
                <p className="text-sm text-gray-600">{recipe.prepTime + recipe.cookTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Portions</p>
                <p className="text-sm text-gray-600">{recipe.servings} pers.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3.5 space-y-3.5">
          <SectionTitle>Ingrédients</SectionTitle>
          <ul className="divide-y divide-gray-100">
            {recipe.ingredients.map((ingredient: Ingredient) => (
              <li key={ingredient.id} className="py-3 flex items-center justify-between">
                <span className="text-gray-900">{ingredient.name}</span>
                <span className="font-medium text-gray-900">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3.5 space-y-3.5">
          <SectionTitle>Préparation</SectionTitle>
          <div className="space-y-3.5">
            {recipe.steps.map((step: Step) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex-none">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {step.order}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{step.description}</p>
                  {step.timer && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{step.timer} min</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <RecipeActions recipeId={recipe.id} />
      </div>
    </div>
  )
} 