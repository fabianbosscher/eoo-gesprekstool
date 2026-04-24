import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const { id } = await params

  const report = await prisma.report.findFirst({
    where: { id, userId },
  })

  if (!report) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  await prisma.report.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
