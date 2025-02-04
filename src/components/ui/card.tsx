'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users } from 'lucide-react'
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

interface CardProps {
  recipe: Recipe
  showFavorite?: boolean
  showActions?: boolean
  onDelete?: () => Promise<void>
  actionIcon?: React.ReactNode
  actionTitle?: string
  extraInfo?: React.ReactNode
}

export function Card({ 
  recipe, 
  showFavorite = true, 
  showActions = false,
  onDelete,
  actionIcon,
  actionTitle,
  extraInfo
}: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start gap-4">
        {recipe.imageUrl && (
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link href={`/recettes/${recipe.id}`}>
            <h2 className="text-base font-semibold text-gray-900 mb-1 hover:text-blue-600">
              {recipe.title}
            </h2>
          </Link>

          <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full mb-2">
            {recipe.category.name}
          </span>

          {extraInfo || (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} pers.</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2">
          {showFavorite && (
            <FavoriteButton recipeId={recipe.id} isFavorite={recipe.isFavorite} />
          )}
          {showActions && onDelete && actionIcon && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
              title={actionTitle}
            >
              {actionIcon}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 