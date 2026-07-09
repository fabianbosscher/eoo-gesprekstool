import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { id } = await params

  const report = await prisma.report.findUnique({
    where: { id },
    include: { user: { select: { name: true, bookingUrl: true } } },
  })
  if (!report) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  const pdfBuffer = await renderReportPDF({
    title: report.title,
    clientName: report.clientName,
    meetingDate: report.meetingDate,
    content: JSON.parse(report.content) as ReportContent,
    creatorName: report.user?.name ?? null,
    bookingUrl: report.showBooking ? report.user?.bookingUrl ?? null : null,
  })

  const filename = `EOO-gespreksverslag-${slugifyFilename(report.clientName)}.pdf`
  const body = new Uint8Array(pdfBuffer)

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
