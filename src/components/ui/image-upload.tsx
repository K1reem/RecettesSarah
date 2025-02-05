'use client'

import { Camera } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ImageUploadProps {
  imageUrl: string | null
  onImageChange: (file: File) => void
  className?: string
}

export function ImageUpload({ imageUrl, onImageChange, className = '' }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImageChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={`relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Aperçu de l'image"
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Camera className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label="Télécharger une image"
      />
    </div>
  )
} 