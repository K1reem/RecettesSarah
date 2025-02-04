import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { recipeId, date, duration, notes, rating } = await request.json()

    const completion = await prisma.recipeCompletion.create({
      data: {
        recipeId,
        date: new Date(date),
        duration,
        notes,
        rating
      },
      include: {
        recipe: {
          select: {
            title: true,
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(completion)
  } catch (error) {
    console.error('Erreur lors de la création de la completion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la completion' },
      { status: 500 }
    )
  }
} 