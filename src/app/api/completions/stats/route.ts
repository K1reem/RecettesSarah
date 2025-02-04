import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [completions, totalRecipes] = await Promise.all([
      prisma.recipeCompletion.findMany(),
      prisma.recipe.count()
    ])

    const ratedCompletions = completions.filter(c => c.rating !== null && c.rating !== undefined)
    const timedCompletions = completions.filter(c => c.duration !== null && c.duration !== undefined)
    
    const stats = {
      totalCompletions: completions.length,
      totalRecipes,
      completionRate: totalRecipes > 0 ? Math.round((completions.length / totalRecipes) * 100) : 0,
      averageRating: ratedCompletions.length > 0 
        ? Number((ratedCompletions.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedCompletions.length).toFixed(1))
        : 0,
      averageDuration: timedCompletions.length > 0
        ? Math.round(timedCompletions.reduce((acc, curr) => acc + (curr.duration || 0), 0) / timedCompletions.length)
        : 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return new NextResponse('Erreur lors de la récupération des statistiques', { status: 500 })
  }
} 