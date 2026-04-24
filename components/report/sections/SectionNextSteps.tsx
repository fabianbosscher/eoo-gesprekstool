import type { ReportNextStep, ReportActionItem } from '@/lib/types'

interface Props {
  id: string
  nextSteps: ReportNextStep[]
  actionItems: ReportActionItem[]
}

export function SectionNextSteps({ id, nextSteps, actionItems }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">Volgende Stappen</h3>

      {nextSteps.length > 0 && (
        <div className="mb-6">
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-eoo-blue flex items-center justify-center shrink-0 text-white font-montserrat font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-eoo-marine font-semibold text-sm">{step.step}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {step.date && (
                      <span className="text-xs text-eoo-blue bg-blue-50 px-2 py-0.5 rounded-full">
                        📅 {step.date}
                      </span>
                    )}
                    {step.owner && (
                      <span className="text-xs text-gray-500">
                        👤 {step.owner}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {actionItems.length > 0 && (
        <div>
          <h4 className="font-montserrat font-bold text-base text-eoo-marine mb-3">Actiepunten</h4>
          <div className="space-y-2">
            {actionItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded bg-eoo-yellow/30 flex items-center justify-center shrink-0 mt-0.5 text-xs">
                  ✓
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{item.action}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">👤 {item.owner}</span>
                    {item.deadline && (
                      <span className="text-xs text-gray-500">📅 {item.deadline}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
