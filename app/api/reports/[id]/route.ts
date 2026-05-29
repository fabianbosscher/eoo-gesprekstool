import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { id } = await params

  const report = await prisma.report.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, bookingUrl: true } } },
  })

  if (!report) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  return NextResponse.json({
    report: {
      id: report.id,
      slug: report.slug,
      title: report.title,
      clientName: report.clientName,
      clientEmail: report.clientEmail,
      meetingDate: report.meetingDate,
      expiresAt: report.expiresAt,
      sentAt: report.sentAt,
      showBooking: report.showBooking,
      content: JSON.parse(report.content),
      userId: report.userId,
      user: report.user,
    },
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const { id } = await params

  const existing = await prisma.report.findFirst({ where: { id, userId } })
  if (!existing) return NextResponse.json({ error: 'Niet gevonden of geen rechten' }, { status: 404 })

  const body = await req.json()
  const data: {
    title?: string
    clientName?: string
    clientEmail?: string
    showBooking?: boolean
    content?: string
  } = {}

  if (typeof body.title === 'string' && body.title.trim()) data.title = body.title.trim()
  if (typeof body.clientName === 'string' && body.clientName.trim()) data.clientName = body.clientName.trim()
  if (typeof body.clientEmail === 'string' && body.clientEmail.trim()) data.clientEmail = body.clientEmail.trim()
  if (typeof body.showBooking === 'boolean') data.showBooking = body.showBooking
  if (body.content && typeof body.content === 'object') data.content = JSON.stringify(body.content)

  const report = await prisma.report.update({
    where: { id },
    data,
  })

  return NextResponse.json({ report: { id: report.id, slug: report.slug } })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const { id } = await params

  const report = await prisma.report.findFirst({ where: { id, userId } })
  if (!report) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  await prisma.report.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
