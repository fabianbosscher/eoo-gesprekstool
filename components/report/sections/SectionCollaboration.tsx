interface Props {
  id: string
  collaboration: string
}

export function SectionCollaboration({ id, collaboration }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">Samenwerking</h3>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-eoo-green/20 flex items-center justify-center shrink-0">
            <span className="text-xl">🤝</span>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">{collaboration}</p>
        </div>
      </div>
    </section>
  )
}
