'use client'

import { RecipeCompletion } from '@/types/recipe'

interface HistoryCardProps {
  completion: RecipeCompletion
  onDelete: (id: number) => Promise<void>
}

export function HistoryCard({ completion, onDelete }: HistoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold">{completion.recipe?.title}</h2>
          <p className="text-sm text-gray-500">
            {new Date(completion.date).toLocaleDateString()}
          </p>
          {completion.duration && (
            <p className="text-sm">Durée: {completion.duration} minutes</p>
          )}
          {completion.notes && (
            <p className="text-sm mt-2">{completion.notes}</p>
          )}
          {completion.rating && (
            <div className="flex items-center mt-1">
              <span className="text-sm">Note: {completion.rating}/5</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(completion.id)}
          className="text-red-500 hover:text-red-700"
        >
          Supprimer
        </button>
      </div>
    </div>
  )
} 