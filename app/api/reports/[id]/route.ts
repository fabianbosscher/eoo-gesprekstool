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
    include: {
      user: { select: { id: true, name: true, bookingUrl: true } },
      editors: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
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
      editorIds: report.editors.map((e) => e.userId),
      editors: report.editors.map((e) => e.user),
    },
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const sessionUser = session.user as { id?: string; role?: string }
  const userId = sessionUser.id!
  const isAdmin = sessionUser.role === 'admin'
  const { id } = await params

  const existing = await prisma.report.findUnique({
    where: { id },
    include: { editors: { select: { userId: true } } },
  })
  if (!existing) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  const isOwner = existing.userId === userId
  const isEditor = existing.editors.some((e) => e.userId === userId)
  const canEdit = isOwner || isAdmin || isEditor
  const canManage = isOwner || isAdmin

  if (!canEdit) {
    return NextResponse.json({ error: 'Geen rechten' }, { status: 403 })
  }

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

  await prisma.report.update({ where: { id }, data })

  // Editors bijwerken — alleen owner/admin mag dit
  if (canManage && Array.isArray(body.editorIds)) {
    const requestedIds = (body.editorIds as unknown[])
      .filter((v): v is string => typeof v === 'string')
      // Owner mag geen editor van zichzelf zijn
      .filter((v) => v !== existing.userId)

    const currentIds = existing.editors.map((e) => e.userId)
    const toAdd = requestedIds.filter((id) => !currentIds.includes(id))
    const toRemove = currentIds.filter((id) => !requestedIds.includes(id))

    if (toRemove.length > 0) {
      await prisma.reportEditor.deleteMany({
        where: { reportId: id, userId: { in: toRemove } },
      })
    }
    if (toAdd.length > 0) {
      await prisma.reportEditor.createMany({
        data: toAdd.map((uid) => ({ reportId: id, userId: uid })),
        skipDuplicates: true,
      })
    }
  }

  return NextResponse.json({ report: { id: existing.id, slug: existing.slug } })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const sessionUser = session.user as { id?: string; role?: string }
  const userId = sessionUser.id!
  const isAdmin = sessionUser.role === 'admin'
  const { id } = await params

  const report = await prisma.report.findUnique({ where: { id } })
  if (!report) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
  if (!isAdmin && report.userId !== userId) {
    return NextResponse.json({ error: 'Geen rechten' }, { status: 403 })
  }

  await prisma.report.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
