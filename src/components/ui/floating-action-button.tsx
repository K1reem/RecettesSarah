'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export function FloatingActionButton() {
  return (
    <Link
      href="/recettes/nouvelle"
      className="fixed right-4 bottom-20 inline-flex items-center justify-center rounded-full w-12 h-12 bg-blue-600 text-white hover:bg-blue-700 shadow-lg z-50"
    >
      <Plus className="w-6 h-6" />
      <span className="sr-only">Ajouter une recette</span>
    </Link>
  )
} 