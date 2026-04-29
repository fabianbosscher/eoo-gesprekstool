import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

  const content = await processTranscription(
    transcription,
    clientName ?? 'Onbekend',
    clientEmail ?? '',
    {
      offerMode: safeOfferMode,
      extraInstructions: typeof extraInstructions === 'string' ? extraInstructions : '',
    }
  )

  return NextResponse.json({ content })
}
