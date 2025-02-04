import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET /api/completions - Récupère toutes les completions de recettes
export async function GET() {
  try {
    const completions = await prisma.$queryRaw`
      SELECT * FROM RecipeCompletion 
      ORDER BY date DESC
    `
    return NextResponse.json(completions)
  } catch (error) {
    console.error('Erreur lors de la récupération des completions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des completions' },
      { status: 500 }
    )
  }
}

// POST /api/completions - Crée une nouvelle completion de recette
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { recipeId, duration, notes, rating } = body

    const completion = await prisma.$executeRaw`
      INSERT INTO RecipeCompletion (recipeId, duration, notes, rating, date)
      VALUES (${recipeId}, ${duration}, ${notes}, ${rating}, datetime('now'))
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la création de la completion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la completion' },
      { status: 500 }
    )
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