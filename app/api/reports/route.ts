import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendReportEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { addDays } from 'date-fns'

// GET: alle rapporten (gedeeld over agents)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      clientName: true,
      clientEmail: true,
      meetingDate: true,
      createdAt: true,
      expiresAt: true,
      sentAt: true,
      userId: true,
      user: { select: { name: true, email: true } },
    },
  })

  return NextResponse.json({ reports })
}

// POST: nieuw rapport aanmaken
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const user = await prisma.user.findUnique({ where: { id: userId } })

  const { title, clientName, clientEmail, meetingDate, password, content, sendEmail } =
    await req.json()

  if (!title || !clientName || !clientEmail || !password || !content) {
    return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 })
  }

  const slug = nanoid(10)
  const passwordHash = await bcrypt.hash(password, 10)
  const expiresAt = addDays(new Date(), 60)

  const report = await prisma.report.create({
    data: {
      slug,
      title,
      clientName,
      clientEmail,
      meetingDate: new Date(meetingDate),
      passwordHash,
      content: JSON.stringify(content),
      expiresAt,
      userId,
    },
  })

  if (sendEmail) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const reportUrl = `${appUrl}/view/${slug}`

    await sendReportEmail({
      to: clientEmail,
      clientName,
      reportTitle: title,
      reportUrl,
      password,
      senderName: user?.name ?? 'Easy Office Online',
    })

    await prisma.report.update({
      where: { id: report.id },
      data: { sentAt: new Date() },
    })
  }

  return NextResponse.json({ report: { id: report.id, slug: report.slug } }, { status: 201 })
}
