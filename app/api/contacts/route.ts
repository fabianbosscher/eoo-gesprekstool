import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: alle bekende contacten
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const contacts = await prisma.knownContact.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ contacts })
}

// POST: nieuw contact aanmaken
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { name, role, company, notes } = await req.json()

  if (typeof name !== 'string' || !name.trim() || typeof role !== 'string' || !role.trim()) {
    return NextResponse.json({ error: 'Naam en functie zijn verplicht' }, { status: 400 })
  }

  const contact = await prisma.knownContact.create({
    data: {
      name: name.trim(),
      role: role.trim(),
      company: typeof company === 'string' && company.trim() ? company.trim() : null,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    },
  })

  return NextResponse.json({ contact }, { status: 201 })
}
