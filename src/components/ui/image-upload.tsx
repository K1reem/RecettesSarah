'use client'

import { Camera } from 'lucide-react'
import { useState } from 'react'

interface ImageUploadProps {
  onChange: (value: string | null) => void
  value?: string | null
}

export function ImageUpload({ onChange, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Erreur lors du téléchargement')
      
      const { url } = await response.json()
      onChange(url)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="block w-full aspect-video bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
      >
        {value ? (
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <div className="text-white">Téléchargement en cours...</div>
          </div>
        )}
      </label>
    </div>
  )
} 