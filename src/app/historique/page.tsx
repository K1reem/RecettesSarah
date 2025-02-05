'use client'

import { useEffect, useState } from 'react'
import { RecipeCompletion } from '@/types/recipe'
import { HistoryCard } from '@/components/ui/history-card'
import { PageTitle } from '@/components/ui/page-title'

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
    <div className="container mx-auto px-4 py-8">
      <PageTitle>Historique des réalisations</PageTitle>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {completions.map((completion) => (
            <HistoryCard
              key={completion.id}
              completion={completion}
              onDelete={handleDelete}
            />
          ))}

          {completions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Aucune réalisation enregistrée
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 