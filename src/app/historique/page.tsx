'use client'

import { useEffect, useState } from 'react'
import { RecipeCompletion } from '@/types/recipe'
import { HistoryCard } from '@/components/ui/history-card'

export default function HistoriquePage() {
  const [completions, setCompletions] = useState<RecipeCompletion[]>([])

  useEffect(() => {
    const fetchCompletions = async () => {
      try {
        const response = await fetch('/api/completions')
        if (!response.ok) throw new Error('Erreur lors de la récupération des completions')
        const data = await response.json()
        setCompletions(data)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    fetchCompletions()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/completions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      // Mettre à jour la liste après la suppression
      setCompletions(completions.filter(completion => completion.id !== id))
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="mx-4 space-y-6">
      <h1 className="text-xl font-semibold">Historique des réalisations</h1>
      
      <div className="grid gap-4">
        {completions.map((completion) => (
          <HistoryCard
            key={completion.id}
            completion={completion}
            onDelete={handleDelete}
          />
        ))}

        {completions.length === 0 && (
          <p className="text-center text-gray-500">
            Aucune réalisation enregistrée
          </p>
        )}
      </div>
    </div>
  )
} 