import Link from 'next/link'
import { Home, Book, Calendar, Heart, History } from 'lucide-react'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        <Link href="/" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <Home size={24} />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        <Link href="/recettes" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <Book size={24} />
          <span className="text-xs mt-1">Recettes</span>
        </Link>
        <Link href="/favoris" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <Heart size={24} />
          <span className="text-xs mt-1">Favoris</span>
        </Link>
        <Link href="/planning" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <Calendar size={24} />
          <span className="text-xs mt-1">Planning</span>
        </Link>
        <Link href="/historique" className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <History size={24} />
          <span className="text-xs mt-1">Historique</span>
        </Link>
      </div>
    </nav>
  )
} 