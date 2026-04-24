'use client'

import { useState } from 'react'
import type { ReportContent } from '@/lib/types'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { SectionOverview } from './sections/SectionOverview'
import { SectionParticipants } from './sections/SectionParticipants'
import { SectionProposition } from './sections/SectionProposition'
import { SectionHighlights } from './sections/SectionHighlights'
import { SectionCollaboration } from './sections/SectionCollaboration'
import { SectionOffer } from './sections/SectionOffer'
import { SectionNextSteps } from './sections/SectionNextSteps'
import { SectionContact } from './sections/SectionContact'

interface ReportData {
  title: string
  clientName: string
  meetingDate: string
  content: ReportContent
}

interface NavItem {
  id: string
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { id: 'overzicht', label: 'Overzicht', icon: '🏠' },
  { id: 'deelnemers', label: 'Deelnemers', icon: '👥' },
  { id: 'propositie', label: 'EOO Propositie', icon: '💡' },
  { id: 'highlights', label: 'Gesprekshighlights', icon: '⭐' },
  { id: 'samenwerking', label: 'Samenwerking', icon: '🤝' },
  { id: 'offerte', label: 'Offerte', icon: '📄' },
  { id: 'stappen', label: 'Volgende Stappen', icon: '🎯' },
  { id: 'contact', label: 'Contact', icon: '✉️' },
]

export function ReportViewer({ report }: { report: ReportData }) {
  const [activeSection, setActiveSection] = useState('overzicht')

  const meetingDateFormatted = format(new Date(report.meetingDate), 'd MMMM yyyy', { locale: nl })

  function scrollTo(id: string) {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-eoo-marine text-white flex-shrink-0 flex flex-col fixed top-0 left-0 bottom-0 z-20 no-print">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <h1 className="font-montserrat font-bold text-base leading-tight">
            Easy <span className="text-eoo-blue">Office</span> Online
          </h1>
          <p className="text-eoo-green text-[10px] mt-0.5 font-semibold uppercase tracking-wide">
            Gespreksverslag & Voorstel
          </p>
          <p className="text-gray-400 text-[11px] mt-2">{meetingDateFormatted}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm transition-all
                ${activeSection === item.id
                  ? 'bg-eoo-blue text-white font-semibold'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-opensans">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Print */}
        <div className="px-5 py-4 border-t border-white/10">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / PDF
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 px-8 py-8 max-w-4xl">
        {/* Page header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h2 className="font-montserrat font-bold text-3xl text-eoo-marine">{report.title}</h2>
          <p className="text-eoo-blue font-montserrat font-semibold text-lg mt-1">
            Gespreksverslag & Voorstel — {meetingDateFormatted}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          <SectionOverview id="overzicht" content={report.content} />
          <SectionParticipants id="deelnemers" participants={report.content.participants} />
          <SectionProposition id="propositie" proposition={report.content.proposition} />
          <SectionHighlights id="highlights" highlights={report.content.highlights} />
          <SectionCollaboration id="samenwerking" collaboration={report.content.collaboration} />
          <SectionOffer id="offerte" offer={report.content.offer} />
          <SectionNextSteps
            id="stappen"
            nextSteps={report.content.nextSteps}
            actionItems={report.content.actionItems}
          />
          <SectionContact id="contact" contact={report.content.contact} />
        </div>
      </main>
    </div>
  )
}
