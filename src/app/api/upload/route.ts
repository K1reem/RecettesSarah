import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return new NextResponse('Aucun fichier fourni', { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    const path = join(process.cwd(), 'public/uploads', filename)

    // Créer le dossier uploads s'il n'existe pas
    await writeFile(join(process.cwd(), 'public/uploads/.gitkeep'), '')

    // Sauvegarder le fichier
    await writeFile(path, buffer)

    // Retourner l'URL du fichier
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return new NextResponse('Erreur lors de l\'upload', { status: 500 })
  }
} 