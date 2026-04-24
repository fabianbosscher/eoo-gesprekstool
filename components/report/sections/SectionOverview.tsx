import type { ReportContent } from '@/lib/types'

interface Props {
  id: string
  content: ReportContent
}

export function SectionOverview({ id, content }: Props) {
  const { overview } = content
  const stats = [
    { value: overview.stats.duration, label: 'Gespreksduur' },
    { value: overview.stats.participants, label: 'Deelnemers' },
    { value: overview.stats.appointmentsPlanned, label: 'Ingepland' },
    { value: overview.stats.dealValue, label: 'Combi-deal' },
  ]

  return (
    <section id={id} className="scroll-mt-8">
      <p className="text-gray-600 leading-relaxed mb-5">{overview.summary}</p>

      <hr className="border-gray-200 mb-5" />

      <h3 className="font-montserrat font-bold text-lg text-eoo-marine mb-3">Key Takeaways</h3>
      <ul className="space-y-2 mb-8">
        {overview.keyTakeaways.map((t, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-eoo-green/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-eoo-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-gray-700 text-sm">{t}</span>
          </li>
        ))}
      </ul>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center py-4">
            <div className="font-montserrat font-bold text-2xl text-eoo-marine">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
