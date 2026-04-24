import type { ReportParticipant } from '@/lib/types'

interface Props {
  id: string
  participants: ReportParticipant[]
}

export function SectionParticipants({ id, participants }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">Deelnemers</h3>
      <div className="grid grid-cols-2 gap-4">
        {participants.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-eoo-blue/10 flex items-center justify-center shrink-0">
              <span className="font-montserrat font-bold text-eoo-blue text-sm">
                {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div>
              <div className="font-montserrat font-bold text-eoo-marine">{p.name}</div>
              <div className="text-sm text-gray-500">{p.role}</div>
              <div className="text-xs text-eoo-blue mt-0.5">{p.company}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
