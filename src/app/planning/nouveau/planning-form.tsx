'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, Users } from 'lucide-react'

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

interface PlanningFormProps {
  recipes: Recipe[]
}

export function PlanningForm({ recipes }: PlanningFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const selectedRecipe = recipes.find(r => r.id.toString() === selectedRecipeId)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: parseInt(selectedRecipeId),
          date: new Date(selectedDate).toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la planification')
      }

      router.push('/planning')
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      alert("Une erreur s'est produite lors de la planification")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-semibold text-gray-900">
            Date du repas
          </label>
          <div className="relative">
            <input
              type="date"
              id="date"
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="recipeId" className="block text-sm font-semibold text-gray-900">
            Recette
          </label>
          <select
            id="recipeId"
            name="recipeId"
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionner une recette</option>
            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.title}
              </option>
            ))}
          </select>
        </div>

        {selectedRecipe && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              {selectedRecipe.imageUrl && (
                <div className="relative w-32 h-24 flex-shrink-0">
                  <Image
                    src={selectedRecipe.imageUrl}
                    alt={selectedRecipe.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div>
                <div className="mb-2">
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                    {selectedRecipe.category.name}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedRecipe.title}
                </h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedRecipe.prepTime + selectedRecipe.cookTime} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{selectedRecipe.servings} pers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Planification en cours...' : 'Planifier le repas'}
      </button>
    </form>
  )
} 