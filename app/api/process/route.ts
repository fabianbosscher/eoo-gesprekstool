import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { processTranscription } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const { transcription, clientName, clientEmail } = await req.json()

  if (!transcription?.trim()) {
    return NextResponse.json({ error: 'Transcriptie is verplicht' }, { status: 400 })
  }

  const content = await processTranscription(
    transcription,
    clientName ?? 'Onbekend',
    clientEmail ?? ''
  )

  return NextResponse.json({ content })
}
