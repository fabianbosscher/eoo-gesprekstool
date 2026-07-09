import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { renderReportPDF } from '@/lib/pdf'
import type { ReportContent } from '@/lib/types'

export const runtime = 'nodejs'

function slugifyFilename(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Wachtwoord vereist' }, { status: 400 })
  }

  const report = await prisma.report.findUnique({
    where: { slug },
    include: { user: { select: { name: true, bookingUrl: true } } },
  })
  if (!report) return NextResponse.json({ error: 'Rapport niet gevonden' }, { status: 404 })

  if (new Date() > report.expiresAt) {
    return NextResponse.json({ error: 'Rapport verlopen' }, { status: 410 })
  }

  const passwordMatch = await bcrypt.compare(password, report.passwordHash)
  if (!passwordMatch) {
    return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 })
  }

  const pdfBuffer = await renderReportPDF({
    title: report.title,
    clientName: report.clientName,
    meetingDate: report.meetingDate,
    content: JSON.parse(report.content) as ReportContent,
    creatorName: report.user?.name ?? null,
    bookingUrl: report.showBooking ? report.user?.bookingUrl ?? null : null,
  })

  const filename = `EOO-gespreksverslag-${slugifyFilename(report.clientName)}.pdf`

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
