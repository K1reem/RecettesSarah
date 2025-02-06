'use client'

import { Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { RecipeImage } from './recipe-image'

interface RecipeCardProps {
  recipe: {
    id: number
    title: string
    imageUrl: string | null
    prepTime: number
    cookTime: number
    servings: number
    category: {
      name: string
    }
  }
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recettes/${recipe.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex">
        {recipe.imageUrl && (
          <div className="relative w-48 flex-none">
            <RecipeImage
              imageUrl={recipe.imageUrl}
              title={recipe.title}
              className="rounded-l-lg h-full"
            />
          </div>
        )}

        <div className={`flex-1 p-4 ${recipe.imageUrl ? '' : 'rounded-l-lg'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {recipe.category.name}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {recipe.title}
          </h3>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                {recipe.prepTime + recipe.cookTime} min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                {recipe.servings} pers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 