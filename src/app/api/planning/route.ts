import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { recipeId, date } = await request.json()

    const schedule = await prisma.schedule.create({
      data: {
        recipeId,
        date: new Date(date),
      },
      include: {
        recipe: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Erreur lors de la création de la planification:', error)
    return new NextResponse('Erreur lors de la création de la planification', { status: 500 })
  }
}

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        recipe: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Erreur lors de la récupération des planifications:', error)
    return new NextResponse('Erreur lors de la récupération des planifications', { status: 500 })
  }
} 