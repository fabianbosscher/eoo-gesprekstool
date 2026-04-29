'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'

interface Report {
  id: string
  slug: string
  title: string
  clientName: string
  clientEmail: string
  meetingDate: string
  createdAt: string
  expiresAt: string
  sentAt: string | null
  userId: string
  user: { name: string; email: string }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/reports')
        .then((r) => r.json())
        .then((d) => {
          setReports(d.reports ?? [])
          setLoading(false)
        })
    }
  }, [status])

  async function handleDelete(id: string) {
    if (!confirm('Weet je zeker dat je dit rapport wilt verwijderen?')) return
    await fetch(`/api/reports/${id}`, { method: 'DELETE' })
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-eoo-marine font-montserrat font-bold">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-eoo-marine text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-montserrat font-bold text-xl">
              Easy <span className="text-eoo-blue">Office</span> Online
            </h1>
            <p className="text-eoo-green text-xs mt-0.5">Gesprekstool</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-montserrat font-bold text-2xl text-eoo-marine">
              Gespreksverslagen
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {reports.length} rapport{reports.length !== 1 ? 'en' : ''}
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-eoo-blue text-white font-montserrat font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors text-sm"
          >
            + Nieuw rapport
          </Link>
        </div>

        {/* Reports list */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-montserrat font-bold text-lg text-eoo-marine mb-2">
              Nog geen rapporten
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Maak je eerste gespreksverslag aan na een klantgesprek.
            </p>
            <Link
              href="/dashboard/new"
              className="bg-eoo-blue text-white font-montserrat font-bold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm"
            >
              Eerste rapport aanmaken
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const expired = new Date() > new Date(report.expiresAt)
              const isOwner = (session?.user as { id?: string })?.id === report.userId
              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:border-eoo-blue/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-montserrat font-bold text-eoo-marine truncate">
                        {report.title}
                      </h3>
                      {expired ? (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full shrink-0">
                          Verlopen
                        </span>
                      ) : report.sentAt ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                          Verstuurd
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full shrink-0">
                          Concept
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {report.clientName} · {report.clientEmail}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Gesprek:{' '}
                      {format(new Date(report.meetingDate), 'd MMMM yyyy', { locale: nl })} ·
                      Verloopt:{' '}
                      {format(new Date(report.expiresAt), 'd MMMM yyyy', { locale: nl })} ·
                      Aangemaakt door: {report.user?.name ?? 'Onbekend'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <a
                      href={`/view/${report.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-eoo-blue hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Bekijken
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${appUrl}/view/${report.slug}`)
                        alert('Link gekopieerd!')
                      }}
                      className="text-sm text-gray-500 hover:text-eoo-marine px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Link kopiëren
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="text-sm text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Verwijderen
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
