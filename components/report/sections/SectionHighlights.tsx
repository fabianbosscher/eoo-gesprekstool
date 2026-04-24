import type { ReportHighlight } from '@/lib/types'

const accentColors = [
  'border-eoo-blue bg-blue-50',
  'border-eoo-green bg-green-50',
  'border-eoo-violet bg-purple-50',
  'border-eoo-yellow bg-yellow-50',
  'border-eoo-orange bg-orange-50',
  'border-eoo-cyan bg-cyan-50',
]

interface Props {
  id: string
  highlights: ReportHighlight[]
}

export function SectionHighlights({ id, highlights }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">
        Gesprekshighlights
      </h3>
      <div className="space-y-3">
        {highlights.map((h, i) => (
          <div
            key={i}
            className={`rounded-2xl border-l-4 p-5 ${accentColors[i % accentColors.length]}`}
          >
            <h4 className="font-montserrat font-bold text-eoo-marine mb-1">{h.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{h.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
