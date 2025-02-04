'use client'

import Link from 'next/link'
import { Plus, Calendar, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface ScheduledRecipe {
  id: number
  date: Date
  recipe: {
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
}

export default function PlanningPage() {
  const router = useRouter()
  const [scheduledRecipes, setScheduledRecipes] = useState<ScheduledRecipe[]>([])

  useEffect(() => {
    fetchScheduledRecipes()
  }, [])

  async function fetchScheduledRecipes() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const response = await fetch('/api/planning')
    const data = await response.json()
    setScheduledRecipes(data)
  }

  async function deleteSchedule(scheduleId: number) {
    try {
      const response = await fetch(`/api/planning/${scheduleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchScheduledRecipes()
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la planification:', error)
    }
  }

  return (
    <div className="mx-4 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Planning des repas</h1>

      {scheduledRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-base font-semibold text-gray-900">Aucun repas planifié</h2>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par planifier votre premier repas.
          </p>
          <div className="mt-6">
            <Link
              href="/planning/nouveau"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Planifier un repas
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledRecipes.map((schedule) => (
            <div key={schedule.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {new Date(schedule.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              <Card
                recipe={schedule.recipe}
                showFavorite={true}
                showActions={true}
                onDelete={() => deleteSchedule(schedule.id)}
                actionIcon={<Trash2 className="w-4 h-4" />}
                actionTitle="Supprimer du planning"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 