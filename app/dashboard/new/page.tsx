'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ReportContent } from '@/lib/types'

type Step = 'input' | 'preview' | 'done'

export default function NewReportPage() {
  const { status } = useSession()
  const router = useRouter()

  const [step, setStep] = useState<Step>('input')
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [transcription, setTranscription] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 10))
  const [reportPassword, setReportPassword] = useState('EOO')
  const [sendEmail, setSendEmail] = useState(true)

  // Generated content
  const [content, setContent] = useState<ReportContent | null>(null)
  const [reportTitle, setReportTitle] = useState('')

  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  async function handleProcess() {
    if (!transcription.trim() || !clientName.trim() || !clientEmail.trim()) {
      setError('Vul alle verplichte velden in')
      return
    }
    setError('')
    setProcessing(true)

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription, clientName, clientEmail }),
      })

      if (!res.ok) throw new Error('Verwerking mislukt')

      const data = await res.json()
      setContent(data.content)
      setReportTitle(`Kennismaking ${clientName}`)
      setStep('preview')
    } catch {
      setError('Er ging iets mis bij het verwerken. Controleer je API key en probeer opnieuw.')
    } finally {
      setProcessing(false)
    }
  }

  async function handleSave() {
    if (!content) return
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reportTitle,
          clientName,
          clientEmail,
          meetingDate,
          password: reportPassword,
          content,
          sendEmail,
        }),
      })

      if (!res.ok) throw new Error('Opslaan mislukt')

      setStep('done')
    } catch {
      setError('Er ging iets mis bij het opslaan. Probeer opnieuw.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-eoo-marine text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-montserrat font-bold text-xl">
              Easy <span className="text-eoo-blue">Office</span> Online
            </h1>
            <p className="text-eoo-green text-xs mt-0.5">Gesprekstool</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Terug naar dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(['input', 'preview', 'done'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-montserrat
                  ${step === s
                    ? 'bg-eoo-blue text-white'
                    : i < ['input', 'preview', 'done'].indexOf(step)
                    ? 'bg-eoo-green text-white'
                    : 'bg-gray-200 text-gray-400'
                  }`}
              >
                {i < ['input', 'preview', 'done'].indexOf(step) ? '✓' : i + 1}
              </div>
              <span
                className={`text-sm ${step === s ? 'text-eoo-marine font-semibold' : 'text-gray-400'}`}
              >
                {s === 'input' ? 'Transcriptie' : s === 'preview' ? 'Controleer' : 'Klaar'}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1: Input */}
        {step === 'input' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h2 className="font-montserrat font-bold text-xl text-eoo-marine">
              Gespreksgegevens invoeren
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Naam klant <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                  placeholder="bijv. René Metz"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  E-mail klant <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                  placeholder="naam@bedrijf.nl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Datum gesprek
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Toegangscode rapport
                </label>
                <input
                  type="text"
                  value={reportPassword}
                  onChange={(e) => setReportPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                  placeholder="bijv. EOO"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Transcriptie gesprek <span className="text-red-400">*</span>
              </label>
              <p className="text-xs text-gray-400 mb-2">
                Plak hier de transcriptie vanuit Teams, een dicteer-app of typ je aantekeningen.
              </p>
              <textarea
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm resize-none font-mono"
                placeholder="Plak hier de transcriptie of aantekeningen van het gesprek..."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 accent-eoo-blue"
              />
              <label htmlFor="sendEmail" className="text-sm text-gray-600">
                Stuur direct een e-mail naar de klant met de rapportlink
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
            )}

            <button
              onClick={handleProcess}
              disabled={processing}
              className="w-full bg-eoo-blue text-white font-montserrat font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Claude verwerkt de transcriptie...' : 'Verwerk met AI →'}
            </button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 'preview' && content && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-montserrat font-bold text-xl text-eoo-marine mb-4">
                Controleer het rapport
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Rapporttitel
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
                />
              </div>

              {/* Samenvatting preview */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-3">
                <div>
                  <span className="font-semibold text-eoo-marine">Samenvatting:</span>
                  <p className="mt-1">{content.overview.summary}</p>
                </div>

                <div>
                  <span className="font-semibold text-eoo-marine">Key Takeaways:</span>
                  <ul className="mt-1 space-y-1">
                    {content.overview.keyTakeaways.map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-eoo-green mt-0.5">✓</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-4 gap-3 pt-2">
                  {[
                    { label: 'Duur', value: content.overview.stats.duration },
                    { label: 'Deelnemers', value: content.overview.stats.participants },
                    { label: 'Afspraken', value: content.overview.stats.appointmentsPlanned },
                    { label: 'Deal', value: content.overview.stats.dealValue },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-lg p-3 text-center">
                      <div className="font-montserrat font-bold text-lg text-eoo-marine">
                        {s.value}
                      </div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('input')}
                className="flex-1 border border-gray-200 text-gray-600 font-montserrat font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Aanpassen
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-2 bg-eoo-green text-eoo-marine font-montserrat font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? 'Opslaan...'
                  : sendEmail
                  ? 'Opslaan & e-mail versturen →'
                  : 'Rapport opslaan →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-eoo-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="font-montserrat font-bold text-2xl text-eoo-marine mb-2">
              Rapport aangemaakt!
            </h2>
            <p className="text-gray-500 mb-8">
              {sendEmail
                ? `Het rapport is opgeslagen en een e-mail is verstuurd naar ${clientEmail}.`
                : 'Het rapport is opgeslagen. Je kunt de link delen via het dashboard.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/dashboard"
                className="border border-gray-200 text-gray-600 font-montserrat font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Terug naar dashboard
              </Link>
              <Link
                href="/dashboard/new"
                className="bg-eoo-blue text-white font-montserrat font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm"
              >
                Nieuw rapport
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
