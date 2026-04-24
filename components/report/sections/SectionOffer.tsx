import type { ReportContent } from '@/lib/types'

interface Props {
  id: string
  offer: ReportContent['offer']
}

export function SectionOffer({ id, offer }: Props) {
  if (!offer?.items?.length) return null

  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">Offerte</h3>

      {offer.intro && (
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{offer.intro}</p>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Items */}
        <table className="w-full">
          <thead>
            <tr className="bg-eoo-marine text-white">
              <th className="text-left px-6 py-3 font-montserrat font-bold text-sm">Dienst / Product</th>
              <th className="text-right px-6 py-3 font-montserrat font-bold text-sm">Prijs</th>
            </tr>
          </thead>
          <tbody>
            {offer.items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-3 text-sm text-gray-700">{item.description}</td>
                <td className="px-6 py-3 text-sm text-right font-semibold text-eoo-marine">{item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-eoo-marine">
              <td className="px-6 py-4 font-montserrat font-bold text-eoo-marine">Totaal</td>
              <td className="px-6 py-4 text-right font-montserrat font-bold text-xl text-eoo-marine">
                {offer.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {offer.validity && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Geldigheid: {offer.validity}
        </p>
      )}
    </section>
  )
}
