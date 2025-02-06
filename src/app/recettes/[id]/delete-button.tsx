'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  recipeId: number
}

export function DeleteButton({ recipeId }: DeleteButtonProps) {
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
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 disabled:opacity-50"
      title="Supprimer la recette"
    >
      <Trash2 className="w-5 h-5 text-red-600" />
    </button>
  )
} 