import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Supprimer d'abord les relations
    await prisma.ingredient.deleteMany({
      where: { recipeId: parseInt(params.id) }
    })

    await prisma.step.deleteMany({
      where: { recipeId: parseInt(params.id) }
    })

    // Supprimer la recette
    await prisma.recipe.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la recette:', error)
    return new NextResponse('Erreur lors de la suppression de la recette', { status: 500 })
  }
} 