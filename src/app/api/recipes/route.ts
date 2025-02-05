import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface Ingredient {
  name: string
  amount: number
  unit: string
}

interface Step {
  description: string
  order: number
  timer: number | null
}

interface RecipeInput {
  title: string
  categoryId: number
  imageUrl: string | null
  ingredients: Ingredient[]
  steps: Step[]
}

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
    const json = await request.json() as RecipeInput

    const recipe = await prisma.recipe.create({
      data: {
        title: json.title,
        categoryId: json.categoryId,
        imageUrl: json.imageUrl || null,
        prepTime: 0, // Valeur par défaut
        cookTime: 0, // Valeur par défaut
        servings: 1, // Valeur par défaut
        isFavorite: false,
        ingredients: {
          create: json.ingredients.map((ingredient: Ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
          })),
        },
        steps: {
          create: json.steps.map((step: Step) => ({
            description: step.description,
            order: step.order,
            timer: step.timer || null,
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
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'Erreur lors de la création de la recette' }, { status: 500 })
  }
} 