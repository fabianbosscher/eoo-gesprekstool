import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { processTranscription, type OfferMode } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { transcription, clientName, clientEmail, offerMode, extraInstructions } =
    await req.json()

  if (!transcription?.trim()) {
    return NextResponse.json({ error: 'Transcriptie is verplicht' }, { status: 400 })
  }

  const validOfferModes: OfferMode[] = ['auto', 'yes', 'no']
  const safeOfferMode: OfferMode = validOfferModes.includes(offerMode) ? offerMode : 'auto'

  // Scan transcript voor bekende namen — externe klant-contacten + interne agents met jobTitle.
  // Alleen meesturen als de naam daadwerkelijk voorkomt, scheelt tokens en voorkomt mismatches.
  const transcriptLower = transcription.toLowerCase()

  const [allContacts, allUsers] = await Promise.all([
    prisma.knownContact.findMany({
      select: { name: true, role: true, company: true, notes: true },
    }),
    prisma.user.findMany({
      where: { jobTitle: { not: null } },
      select: { name: true, jobTitle: true },
    }),
  ])

  const agentHints = allUsers.map((u) => ({
    name: u.name,
    role: u.jobTitle!,
    company: 'Easy Office Online',
    notes: null,
  }))

  const relevantContacts = [...agentHints, ...allContacts].filter((c) =>
    transcriptLower.includes(c.name.toLowerCase())
  )

  const content = await processTranscription(
    transcription,
    clientName ?? 'Onbekend',
    clientEmail ?? '',
    {
      offerMode: safeOfferMode,
      extraInstructions: typeof extraInstructions === 'string' ? extraInstructions : '',
      knownContacts: relevantContacts,
    }
  )

  return NextResponse.json({ content })
}
