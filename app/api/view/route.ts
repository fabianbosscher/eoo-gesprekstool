import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Validate password and return report content
export async function POST(req: NextRequest) {
  const { slug, password } = await req.json()

  if (!slug || !password) {
    return NextResponse.json({ error: 'Ontbrekende gegevens' }, { status: 400 })
  }

  const report = await prisma.report.findUnique({
    where: { slug },
    include: { user: { select: { name: true } } },
  })

  if (!report) {
    return NextResponse.json({ error: 'Rapport niet gevonden' }, { status: 404 })
  }

  if (new Date() > report.expiresAt) {
    return NextResponse.json({ error: 'Dit rapport is verlopen' }, { status: 410 })
  }

  const passwordMatch = await bcrypt.compare(password, report.passwordHash)
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 })
  }

  return NextResponse.json({
    title: report.title,
    clientName: report.clientName,
    meetingDate: report.meetingDate,
    content: JSON.parse(report.content),
    creatorName: report.user?.name ?? null,
  })
}
