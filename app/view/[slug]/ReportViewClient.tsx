'use client'

import { useState } from 'react'
import type { ReportContent } from '@/lib/types'
import { ReportViewer } from '@/components/report/ReportViewer'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface ReportData {
  title: string
  clientName: string
  meetingDate: string
  content: ReportContent
  creatorName: string | null
}

export function ReportViewClient({ slug }: { slug: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ReportData | null>(null)

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password }),
      })

      if (res.status === 401) {
        setError('Onjuist wachtwoord')
        return
      }
      if (res.status === 404) {
        setError('Rapport niet gevonden')
        return
      }
      if (res.status === 410) {
        setError('Dit rapport is verlopen en niet meer beschikbaar')
        return
      }
      if (!res.ok) {
        setError('Er ging iets mis. Probeer het opnieuw.')
        return
      }

      const data = await res.json()
      setReport(data)
    } catch {
      setError('Verbindingsfout. Controleer je internetverbinding.')
    } finally {
      setLoading(false)
    }
  }

  if (report) {
    return <ReportViewer report={report} />
  }

  return (
    <div className="min-h-screen bg-eoo-marine flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-montserrat text-3xl font-bold text-white">
            Easy <span className="text-eoo-blue">Office</span> Online
          </h1>
          <p className="text-eoo-green mt-2 text-sm">Gespreksverslag</p>
        </div>

        {/* Unlock card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-eoo-marine/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-eoo-marine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="font-montserrat font-bold text-eoo-marine">Beveiligd rapport</h2>
              <p className="text-xs text-gray-400">Voer de toegangscode in om te bekijken</p>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Toegangscode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm tracking-widest"
                placeholder="••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-eoo-blue text-white font-montserrat font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Controleren...' : 'Rapport bekijken'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-5">
            De toegangscode heeft u ontvangen per e-mail
          </p>
        </div>
      </div>
    </div>
  )
}
