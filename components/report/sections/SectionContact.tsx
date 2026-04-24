import type { ReportContent } from '@/lib/types'

interface Props {
  id: string
  contact: ReportContent['contact']
}

export function SectionContact({ id, contact }: Props) {
  return (
    <section id={id} className="scroll-mt-8">
      <h3 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">Contact</h3>

      <div className="bg-gradient-to-br from-eoo-marine to-blue-900 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-eoo-blue/30 flex items-center justify-center shrink-0">
            <span className="font-montserrat font-bold text-xl text-white">
              {contact.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
          </div>

          <div className="flex-1">
            <div className="font-montserrat font-bold text-lg">{contact.name}</div>
            <div className="text-eoo-blue text-sm">{contact.role}</div>
            <div className="text-gray-400 text-sm mt-0.5">{contact.company}</div>

            <div className="mt-4 space-y-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {contact.phone}
                </a>
              )}
              {contact.website && (
                <a
                  href={`https://${contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  {contact.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* EOO Tagline */}
        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="font-montserrat font-bold italic text-eoo-green">Dat is Easy.</p>
        </div>
      </div>
    </section>
  )
}
