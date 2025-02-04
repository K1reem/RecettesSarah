'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, Trash2 } from 'lucide-react'
import { FavoriteButton } from '@/app/recettes/[id]/favorite-button'

interface Recipe {
  id: number
  title: string
  imageUrl?: string | null
  prepTime: number
  cookTime: number
  servings: number
  isFavorite: boolean
  category: {
    name: string
  }
}

interface RecipeCardProps {
  recipe: Recipe
  scheduleId?: number
  showFavorite?: boolean
  onScheduleDelete?: (scheduleId: number) => Promise<void>
}

export function RecipeCard({ recipe, scheduleId, showFavorite = true, onScheduleDelete }: RecipeCardProps) {
  return (
    <div className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <Link href={`/recettes/${recipe.id}`} className="flex-1">
            <div className="flex items-start gap-6">
              {recipe.imageUrl && (
                <div className="relative w-48 h-32 flex-shrink-0">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {recipe.category.name}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                  {recipe.title}
                </h2>

                <div className="flex items-center gap-6 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{recipe.servings} pers.</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex items-start gap-2 ml-4">
            {showFavorite && (
              <FavoriteButton recipeId={recipe.id} isFavorite={recipe.isFavorite} />
            )}
            {scheduleId && onScheduleDelete && (
              <button
                onClick={() => onScheduleDelete(scheduleId)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                title="Supprimer du planning"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 