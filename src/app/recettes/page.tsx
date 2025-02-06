'use client'

import { useState, useEffect } from 'react'
import { PageTitle } from '@/components/ui/page-title'
import { RecipeCard } from '@/components/ui/recipe-card'

interface Recipe {
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
    <div className="container mx-auto px-4 py-4">
      <PageTitle>Mes Recettes</PageTitle>
      
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}

        {recipes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Aucune recette pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
} 