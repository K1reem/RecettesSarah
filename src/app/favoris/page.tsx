'use client'

import { Book } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface Recipe {
  id: number
  title: string
  imageUrl: string | null
  prepTime: number
  cookTime: number
  servings: number
  isFavorite: boolean
  category: {
    name: string
  }
}

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch('/api/recipes?favorites=true')
        if (response.ok) {
          const data = await response.json()
          setRecipes(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error)
      }
    }

    fetchFavorites()
  }, [])

  return (
    <div className="mx-4 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Mes Favoris</h1>

      {recipes.length > 0 ? (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} recipe={recipe} showFavorite={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Ajoutez des recettes à vos favoris pour les retrouver facilement ici
          </p>
          <Link
            href="/recettes"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Découvrir les recettes
          </Link>
        </div>
      )}
    </div>
  )
} 