'use client'

import { useState } from 'react'
import { CookingMode } from './cooking-mode'
import { Step } from '@/types/recipe'

interface StartCookingButtonProps {
  steps: Step[]
}

export function StartCookingButton({ steps }: StartCookingButtonProps) {
  const [isInCookingMode, setIsInCookingMode] = useState(false)

  // Trier les étapes par ordre
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order)

  if (isInCookingMode) {
    return <CookingMode steps={sortedSteps} onExit={() => setIsInCookingMode(false)} />
  }

  return (
    <button
      onClick={() => setIsInCookingMode(true)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Commencer la recette
    </button>
  )
} 