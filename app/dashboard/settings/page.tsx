'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

interface Profile {
  id: string
  name: string
  email: string
  bookingUrl: string | null
}

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [bookingUrl, setBookingUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile')
        .then((r) => r.json())
        .then((d) => {
          if (d.user) {
            setProfile(d.user)
            setName(d.user.name)
            setBookingUrl(d.user.bookingUrl ?? '')
          }
        })
    }
  }, [status])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess('')
    setError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bookingUrl }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setProfile(data.user)
      setSuccess('Instellingen opgeslagen!')
    } catch {
      setError('Er ging iets mis bij het opslaan.')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-eoo-marine font-montserrat font-bold">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-eoo-marine text-white px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <Logo variant="light" height={32} className="text-white text-xl" />
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

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="font-montserrat font-bold text-2xl text-eoo-marine mb-6">
          Mijn instellingen
        </h2>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Naam</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Microsoft Bookings link
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Plak hier je persoonlijke Bookings-pagina. Als je dit bij een rapport aanzet, krijgt de klant een knop om direct een vervolgafspraak in te plannen.
            </p>
            <input
              type="url"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://outlook.office.com/bookwithme/..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
          {success && (
            <p className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-lg">{success}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-eoo-blue text-white font-montserrat font-bold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </form>
      </main>
    </div>
  )
}
