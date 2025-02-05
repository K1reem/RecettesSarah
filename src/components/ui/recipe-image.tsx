'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'

interface RecipeImageProps {
  imageUrl: string | null
  title: string
  className?: string
}

export function RecipeImage({ imageUrl, title, className = '' }: RecipeImageProps) {
  return (
    <div className={`relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Camera className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  )
} 