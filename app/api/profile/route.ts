import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, bookingUrl: true },
  })

  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const { name, bookingUrl } = await req.json()

  const data: { name?: string; bookingUrl?: string | null } = {}
  if (typeof name === 'string' && name.trim()) data.name = name.trim()
  if (typeof bookingUrl === 'string') {
    const trimmed = bookingUrl.trim()
    data.bookingUrl = trimmed.length ? trimmed : null
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, bookingUrl: true },
  })

  return NextResponse.json({ user })
}
