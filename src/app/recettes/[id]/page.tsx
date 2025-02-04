import { prisma } from '@/lib/prisma'
import { ArrowLeft, Clock, Users, Camera } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FavoriteButton, StartCookingButton } from '.'
import Image from 'next/image'
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/recettes"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="sr-only">Retour</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton recipeId={recipe.id} isFavorite={recipe.isFavorite} />
            <StartCookingButton steps={recipe.steps} />
          </div>
        </div>

        <div className="relative">
          {recipe.imageUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
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
      </header>

      <section className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Ingrédients</h2>
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
      </section>

      <section className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Préparation</h2>
        <div className="space-y-6">
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
      </section>
    </div>
  )
} 