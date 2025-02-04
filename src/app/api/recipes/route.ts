import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get('favorites') === 'true'

    const recipes = await prisma.recipe.findMany({
      where: favorites ? {
        isFavorite: true
      } : undefined,
      include: {
        category: true,
      },
      orderBy: favorites ? {
        title: 'asc'
      } : {
        createdAt: 'desc'
      },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Erreur lors de la récupération des recettes:', error)
    return new NextResponse('Erreur lors de la récupération des recettes', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()

    const recipe = await prisma.recipe.create({
      data: {
        title: json.title,
        categoryId: json.categoryId,
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
            isCompleted: false,
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
    console.error('Erreur lors de la création de la recette:', error)
    return new NextResponse('Erreur lors de la création de la recette', { status: 500 })
  }
} 