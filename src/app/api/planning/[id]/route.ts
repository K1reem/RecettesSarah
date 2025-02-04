import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.schedule.delete({
      where: {
        id: parseInt(params.id),
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Erreur lors de la suppression de la planification:', error)
    return new NextResponse('Erreur lors de la suppression de la planification', { status: 500 })
  }
} 