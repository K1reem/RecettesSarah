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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json()
    const recipeId = parseInt(params.id)

    // Supprimer les relations existantes
    await prisma.ingredient.deleteMany({
      where: { recipeId }
    })

    await prisma.step.deleteMany({
      where: { recipeId }
    })

    // Mettre à jour la recette avec les nouvelles données
    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title: json.title,
        categoryId: json.categoryId,
        imageUrl: json.imageUrl,
        prepTime: json.prepTime,
        cookTime: json.cookTime,
        servings: json.servings,
        ingredients: {
          create: json.ingredients.map((ingredient: any) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          })),
        },
        steps: {
          create: json.steps.map((step: any) => ({
            description: step.description,
            order: step.order,
            timer: step.timer,
          })),
        },
      },
      include: {
        category: true,
        ingredients: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Erreur lors de la modification de la recette:', error)
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'Erreur lors de la modification de la recette' }, { status: 500 })
  }
} 