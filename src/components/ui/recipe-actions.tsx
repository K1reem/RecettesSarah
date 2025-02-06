'use client'

import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RecipeActionsProps {
  recipeId: number
}

export function RecipeActions({ recipeId }: RecipeActionsProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      router.push('/recettes')
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue lors de la suppression de la recette')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-8">
      <Link
        href={`/recettes/${recipeId}/modifier`}
        className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        <Edit className="w-5 h-5" />
        Modifier la recette
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center justify-center gap-2 px-4 py-2 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
        Supprimer la recette
      </button>
    </div>
  )
} 