import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isFavorite } = await request.json()

    const recipe = await prisma.recipe.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        isFavorite
      }
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du favori:', error)
    return new NextResponse('Erreur lors de la mise à jour du favori', { status: 500 })
  }
} 