'use client'

import { useState } from 'react'
import type { ReportContent } from '@/lib/types'
import { formatDateNL } from '@/lib/dates'
import { SectionOverview } from './sections/SectionOverview'
import { SectionParticipants } from './sections/SectionParticipants'
import { SectionProposition } from './sections/SectionProposition'
import { SectionHighlights } from './sections/SectionHighlights'
import { SectionCollaboration } from './sections/SectionCollaboration'
import { SectionOffer } from './sections/SectionOffer'
import { SectionNextSteps } from './sections/SectionNextSteps'
import { SectionContact } from './sections/SectionContact'
import { Logo } from '@/components/Logo'

interface ReportData {
  title: string
  clientName: string
  meetingDate: string
  content: ReportContent
  creatorName: string | null
  bookingUrl: string | null
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

export function ReportViewer({
  report,
  slug,
  password,
}: {
  report: ReportData
  slug?: string
  password?: string
}) {
  const [activeSection, setActiveSection] = useState('overzicht')
  const [downloading, setDownloading] = useState(false)

  const meetingDateFormatted = formatDateNL(report.meetingDate)

  async function handleDownloadPDF() {
    if (!slug || !password) return
    setDownloading(true)
    try {
      const res = await fetch(`/api/view/${slug}/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error('PDF-download mislukt')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `EOO-gespreksverslag-${report.clientName}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Er ging iets mis bij het genereren van de PDF.')
    } finally {
      setDownloading(false)
    }
  }

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
          <Logo variant="light" height={28} className="text-base leading-tight" />
          <p className="text-eoo-green text-[10px] mt-2 font-semibold uppercase tracking-wide">
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

        {/* Download */}
        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          {slug && password && (
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="w-full bg-eoo-blue text-white font-montserrat font-bold text-xs py-2.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {downloading ? 'PDF genereren...' : 'Download PDF'}
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 text-[11px] text-gray-400 hover:text-white transition-colors py-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print (browser)
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
          {report.creatorName && (
            <p className="text-gray-500 text-sm mt-2">
              Opgesteld door {report.creatorName}
            </p>
          )}
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
            bookingUrl={report.bookingUrl}
          />
          <SectionContact id="contact" contact={report.content.contact} />
        </div>
      </main>
    </div>
  )
}
