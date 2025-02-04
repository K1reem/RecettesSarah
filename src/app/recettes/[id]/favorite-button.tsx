'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

interface FavoriteButtonProps {
  recipeId: number
  isFavorite: boolean
}

export function FavoriteButton({ recipeId, isFavorite: initialIsFavorite }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleFavorite = async () => {
    if (isUpdating) return
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: !isFavorite }),
      })

      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isUpdating}
      className={`p-2 rounded-full hover:bg-gray-100 ${
        isFavorite ? 'text-red-500' : 'text-gray-400'
      }`}
    >
      <Heart className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  )
} 