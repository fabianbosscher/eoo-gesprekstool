'use client'

import { useEffect, useState, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ReportContent, ReportParticipant, ReportHighlight } from '@/lib/types'
import { Logo } from '@/components/Logo'

interface ReportData {
  id: string
  slug: string
  title: string
  clientName: string
  clientEmail: string
  showBooking: boolean
  content: ReportContent
  userId: string
  user: { id: string; name: string; bookingUrl: string | null }
}

export default function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()

  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Editable fields
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [showBooking, setShowBooking] = useState(false)
  const [summary, setSummary] = useState('')
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([])
  const [participants, setParticipants] = useState<ReportParticipant[]>([])
  const [highlights, setHighlights] = useState<ReportHighlight[]>([])
  const [proposition, setProposition] = useState('')
  const [collaboration, setCollaboration] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/reports/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.report) {
          setReport(d.report)
          setTitle(d.report.title)
          setClientName(d.report.clientName)
          setClientEmail(d.report.clientEmail)
          setShowBooking(d.report.showBooking)
          setSummary(d.report.content.overview.summary)
          setKeyTakeaways(d.report.content.overview.keyTakeaways)
          setParticipants(d.report.content.participants)
          setHighlights(d.report.content.highlights)
          setProposition(d.report.content.proposition)
          setCollaboration(d.report.content.collaboration)
        }
        setLoading(false)
      })
  }, [id, status])

  const isOwner = report && (session?.user as { id?: string })?.id === report.userId

  async function handleSave() {
    if (!report) return
    setSaving(true)
    setSuccess('')
    setError('')

    const updatedContent: ReportContent = {
      ...report.content,
      overview: {
        ...report.content.overview,
        summary,
        keyTakeaways: keyTakeaways.filter((k) => k.trim()),
      },
      participants: participants.filter((p) => p.name.trim()),
      highlights: highlights.filter((h) => h.title.trim() || h.content.trim()),
      proposition,
      collaboration,
    }

    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          clientName,
          clientEmail,
          showBooking,
          content: updatedContent,
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess('Rapport bijgewerkt!')
    } catch {
      setError('Er ging iets mis bij het opslaan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-eoo-marine font-montserrat font-bold">Laden...</div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">Rapport niet gevonden</div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center max-w-md">
          <h2 className="font-montserrat font-bold text-eoo-marine mb-2">Geen toegang</h2>
          <p className="text-gray-500 text-sm mb-4">
            Alleen de agent die dit rapport heeft aangemaakt ({report.user?.name}) kan het bewerken.
          </p>
          <Link
            href="/dashboard"
            className="text-eoo-blue text-sm hover:underline"
          >
            ← Terug naar dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-eoo-marine text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <Logo variant="light" height={32} className="text-white text-xl" />
            <p className="text-eoo-green text-xs mt-0.5">Rapport bewerken</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Terug naar dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-5">
        {/* Basics */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-montserrat font-bold text-lg text-eoo-marine">Algemeen</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rapporttitel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Naam klant
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                E-mail klant
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              checked={showBooking}
              onChange={(e) => setShowBooking(e.target.checked)}
              className="w-4 h-4 accent-eoo-blue"
            />
            <span className="text-sm text-gray-600">
              Toon &quot;Vervolgafspraak inplannen&quot;-knop in het rapport
              {!report.user?.bookingUrl && (
                <span className="block text-xs text-red-500 mt-0.5">
                  Let op: je hebt nog geen Bookings-link ingesteld in{' '}
                  <Link href="/dashboard/settings" className="underline">Instellingen</Link>.
                </span>
              )}
            </span>
          </label>
        </div>

        {/* Samenvatting */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-montserrat font-bold text-lg text-eoo-marine">Samenvatting</h2>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm resize-none"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Key Takeaways
            </label>
            <div className="space-y-2">
              {keyTakeaways.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={t}
                    onChange={(e) => {
                      const next = [...keyTakeaways]
                      next[i] = e.target.value
                      setKeyTakeaways(next)
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setKeyTakeaways(keyTakeaways.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 px-3 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setKeyTakeaways([...keyTakeaways, ''])}
                className="text-eoo-blue text-sm hover:underline"
              >
                + Takeaway toevoegen
              </button>
            </div>
          </div>
        </div>

        {/* Deelnemers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-montserrat font-bold text-lg text-eoo-marine">Deelnemers</h2>
          <div className="space-y-3">
            {participants.map((p, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Naam"
                  value={p.name}
                  onChange={(e) => {
                    const next = [...participants]
                    next[i] = { ...next[i], name: e.target.value }
                    setParticipants(next)
                  }}
                  className="col-span-4 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                />
                <input
                  type="text"
                  placeholder="Functie"
                  value={p.role}
                  onChange={(e) => {
                    const next = [...participants]
                    next[i] = { ...next[i], role: e.target.value }
                    setParticipants(next)
                  }}
                  className="col-span-4 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                />
                <input
                  type="text"
                  placeholder="Bedrijf"
                  value={p.company}
                  onChange={(e) => {
                    const next = [...participants]
                    next[i] = { ...next[i], company: e.target.value }
                    setParticipants(next)
                  }}
                  className="col-span-3 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                />
                <button
                  type="button"
                  onClick={() => setParticipants(participants.filter((_, idx) => idx !== i))}
                  className="col-span-1 text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setParticipants([...participants, { name: '', role: '', company: '' }])
              }
              className="text-eoo-blue text-sm hover:underline"
            >
              + Deelnemer toevoegen
            </button>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-montserrat font-bold text-lg text-eoo-marine">
            Gesprekshighlights
          </h2>
          <p className="text-xs text-gray-400">
            Categorieën: Algemeen, Telefonie, Internet, Netwerk, Werkplekken, Overig.
          </p>
          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Categorie (bijv. Telefonie)"
                    value={h.title}
                    onChange={(e) => {
                      const next = [...highlights]
                      next[i] = { ...next[i], title: e.target.value }
                      setHighlights(next)
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 px-2 text-sm"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  value={h.content}
                  onChange={(e) => {
                    const next = [...highlights]
                    next[i] = { ...next[i], content: e.target.value }
                    setHighlights(next)
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm resize-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setHighlights([...highlights, { title: '', content: '' }])}
              className="text-eoo-blue text-sm hover:underline"
            >
              + Highlight toevoegen
            </button>
          </div>
        </div>

        {/* Propositie + samenwerking */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              EOO Propositie
            </label>
            <textarea
              value={proposition}
              onChange={(e) => setProposition(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Samenwerking</label>
            <textarea
              value={collaboration}
              onChange={(e) => setCollaboration(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm resize-none"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
        {success && (
          <p className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-lg">{success}</p>
        )}

        <div className="flex gap-3 sticky bottom-4">
          <a
            href={`/view/${report.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-200 bg-white text-gray-600 font-montserrat font-bold py-3 px-6 rounded-xl hover:bg-gray-50 text-sm"
          >
            Bekijk live →
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-eoo-blue text-white font-montserrat font-bold py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 text-sm"
          >
            {saving ? 'Opslaan...' : 'Wijzigingen opslaan'}
          </button>
        </div>
      </main>
    </div>
  )
}
