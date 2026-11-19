import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const data: { name?: string; role?: string; company?: string | null; notes?: string | null } = {}
  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim()
  if (typeof body.role === 'string' && body.role.trim()) data.role = body.role.trim()
  if (typeof body.company === 'string') {
    const trimmed = body.company.trim()
    data.company = trimmed.length ? trimmed : null
  }
  if (typeof body.notes === 'string') {
    const trimmed = body.notes.trim()
    data.notes = trimmed.length ? trimmed : null
  }

  const contact = await prisma.knownContact.update({
    where: { id },
    data,
  })

  return NextResponse.json({ contact })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { id } = await params
  await prisma.knownContact.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
