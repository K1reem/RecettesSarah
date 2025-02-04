'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Erreur:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-4 text-red-500">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Une erreur est survenue</h1>
      <p className="text-gray-600 mb-8">
        Nous nous excusons pour la gêne occasionnée. Veuillez réessayer.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Réessayer
      </button>
    </div>
  )
} 