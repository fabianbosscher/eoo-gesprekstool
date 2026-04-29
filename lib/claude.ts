import Anthropic from '@anthropic-ai/sdk'
import type { ReportContent } from './types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Je bent een assistent die gespreksverslagen maakt voor Easy Office Online, een dienstverlener voor MKB-bedrijven.

Je ontvangt een ruwe transcriptie van een klantgesprek en genereert daaruit een gestructureerd JSON-rapport.

Richtlijnen:
- Schrijf professioneel maar toegankelijk Nederlands
- Wees concreet en specifiek — gebruik namen, data en bedragen uit de transcriptie
- Destilleer de essentie: wat is er besproken, wat zijn de afspraken, wat zijn de next steps
- Als informatie ontbreekt, gebruik dan een lege string of lege array — verzin niets
- Schat de gespreksduur in op basis van de transcriptie (bijv. "~45 min")
- Het dealValue veld is het totale offertebedrag, of leeg als er geen offerte was

Geef ALLEEN de JSON terug, zonder markdown code blocks, geen uitleg, geen json prefix.`

export type OfferMode = 'auto' | 'yes' | 'no'

export interface ProcessOptions {
  offerMode?: OfferMode
  extraInstructions?: string
}

function buildOptionsBlock(options: ProcessOptions): string {
  const lines: string[] = []

  if (options.offerMode === 'yes') {
    lines.push(
      '- Offerte: BRENG ALTIJD een offerte uit. Vul het "offer" object volledig in met concrete items en bedragen. Als de transcriptie geen prijzen noemt, maak dan een redelijke schatting op basis van het besproken werk en geef dat aan in "intro".'
    )
  } else if (options.offerMode === 'no') {
    lines.push(
      '- Offerte: BRENG GEEN offerte uit. Vul het "offer" object met lege waarden: intro = "", items = [], total = "", validity = "". Zet ook dealValue op "€0".'
    )
  } else {
    lines.push(
      '- Offerte: alleen invullen als er in de transcriptie daadwerkelijk een offerte of bedragen zijn besproken. Anders alle offer-velden leeg laten.'
    )
  }

  if (options.extraInstructions?.trim()) {
    lines.push(`- Extra instructies van de agent: ${options.extraInstructions.trim()}`)
  }

  return lines.length ? `\n\nAanvullende instructies voor dit rapport:\n${lines.join('\n')}` : ''
}

export async function processTranscription(
  transcription: string,
  contactName: string,
  contactEmail: string,
  options: ProcessOptions = {}
): Promise<ReportContent> {
  const optionsBlock = buildOptionsBlock(options)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Verwerk deze gespreksopname naar een gestructureerd rapport.

Contactpersoon klant: ${contactName}
E-mail klant: ${contactEmail}

Transcriptie:
---
${transcription}
---${optionsBlock}

Genereer een JSON object met deze exacte structuur:
{
  "overview": {
    "summary": "2-3 zinnen samenvatting van het gesprek",
    "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4"],
    "stats": {
      "duration": "~40 min",
      "participants": 2,
      "appointmentsPlanned": 0,
      "dealValue": "€0"
    }
  },
  "participants": [
    {"name": "naam", "role": "functie", "company": "bedrijfsnaam"}
  ],
  "proposition": "Beschrijving van wat Easy Office Online aanbiedt, relevant voor dit gesprek",
  "highlights": [
    {"title": "Onderwerp 1", "content": "Wat is er over dit onderwerp besproken"},
    {"title": "Onderwerp 2", "content": "..."}
  ],
  "collaboration": "Beschrijving van de samenwerkingsmogelijkheden die besproken zijn",
  "offer": {
    "intro": "Korte intro bij de offerte",
    "items": [
      {"description": "Dienst of product", "price": "€ bedrag"}
    ],
    "total": "€ totaal",
    "validity": "Geldig tot datum of periode"
  },
  "actionItems": [
    {"owner": "naam", "action": "actie", "deadline": "datum of termijn"}
  ],
  "nextSteps": [
    {"step": "stap", "date": "datum", "owner": "naam"}
  ],
  "contact": {
    "name": "naam EOO contactpersoon",
    "role": "functie",
    "email": "e-mail",
    "phone": "telefoonnummer",
    "company": "Easy Office Online",
    "website": "www.easyofficeonline.nl"
  }
}`,
      },
    ],
    system: SYSTEM_PROMPT,
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '')
  return JSON.parse(cleaned) as ReportContent
}
