'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PageTitleProps {
  children: React.ReactNode
  showBack?: boolean
  action?: React.ReactNode
}

export function PageTitle({ children, showBack = false, action }: PageTitleProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 mb-4">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="text-gray-900 hover:text-gray-600"
          aria-label="Retour"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-900 flex-1">
        {children}
      </h1>
      {action && (
        <div className="flex-none">
          {action}
        </div>
      )}
    </div>
  )
} 