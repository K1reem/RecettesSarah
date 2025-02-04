'use client'

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

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('/api/recipes')
        if (response.ok) {
          const data = await response.json()
          setRecipes(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des recettes:', error)
      }
    }

    fetchRecipes()
  }, [])

  return (
    <div className="mx-4 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Mes Recettes</h1>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id} recipe={recipe} />
        ))}

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Aucune recette pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
} 