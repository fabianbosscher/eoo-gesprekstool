interface Props {
  id: string
  proposition: string
}

export function SectionProposition({ id, proposition }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">
        Easy Office Online — Onze Propositie
      </h3>
      <div className="bg-gradient-to-br from-eoo-marine to-blue-900 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-eoo-blue/30 flex items-center justify-center shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <p className="text-gray-200 leading-relaxed text-sm">{proposition}</p>
        </div>
      </div>
    </section>
  )
}
