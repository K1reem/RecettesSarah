import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/completions - Récupère toutes les completions de recettes
export async function GET() {
  try {
    const completions = await prisma.recipeCompletion.findMany({
      include: {
        recipe: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(completions)
  } catch (error) {
    console.error('Erreur lors de la récupération des completions:', error)
    return new NextResponse('Erreur lors de la récupération des completions', { status: 500 })
  }
}

// POST /api/completions - Crée une nouvelle completion de recette
export async function POST(request: Request) {
  try {
    const json = await request.json()
    const completion = await prisma.recipeCompletion.create({
      data: {
        recipeId: json.recipeId,
        date: new Date(),
      },
      include: {
        recipe: true,
      },
    })

    return NextResponse.json(completion)
  } catch (error) {
    console.error('Erreur lors de la création de la completion:', error)
    return new NextResponse('Erreur lors de la création de la completion', { status: 500 })
  }
}

// DELETE /api/completions/:id - Supprime une completion de recette
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$executeRaw`
      DELETE FROM RecipeCompletion 
      WHERE id = ${parseInt(params.id)}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la completion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la completion' },
      { status: 500 }
    )
  }
} 