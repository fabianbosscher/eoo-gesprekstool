'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

interface Contact {
  id: string
  name: string
  role: string
  company: string | null
  notes: string | null
}

export default function ContactsPage() {
  const { status } = useSession()
  const router = useRouter()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Nieuw contact
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [adding, setAdding] = useState(false)

  // Inline bewerken
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<Contact>>({})

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/contacts')
      .then((r) => r.json())
      .then((d) => {
        setContacts(d.contacts ?? [])
        setLoading(false)
      })
  }, [status])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newRole.trim()) {
      setError('Naam en functie zijn verplicht')
      return
    }
    setError('')
    setAdding(true)
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, role: newRole, company: newCompany, notes: newNotes }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContacts((prev) => [...prev, data.contact].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setNewRole('')
      setNewCompany('')
      setNewNotes('')
    } catch {
      setError('Toevoegen mislukt')
    } finally {
      setAdding(false)
    }
  }

  async function handleSaveEdit(id: string) {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDraft),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContacts((prev) =>
        prev
          .map((c) => (c.id === id ? data.contact : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditingId(null)
      setEditDraft({})
    } catch {
      setError('Opslaan mislukt')
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Contact "${name}" verwijderen?`)) return
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-eoo-marine font-montserrat font-bold">Laden...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-eoo-marine text-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <Logo variant="light" height={32} className="text-white text-xl" />
            <p className="text-eoo-green text-xs mt-0.5">Bekende contactpersonen</p>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Terug naar dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h2 className="font-montserrat font-bold text-2xl text-eoo-marine">Bekende contacten</h2>
          <p className="text-sm text-gray-500 mt-1">
            Claude gebruikt deze lijst als context. Als een naam uit deze lijst in de transcriptie voorkomt,
            krijgt die persoon automatisch de juiste functie en bedrijf.
          </p>
        </div>

        {/* Nieuw contact toevoegen */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
        >
          <h3 className="font-montserrat font-bold text-lg text-eoo-marine">Nieuw contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Naam <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="bijv. René Metz"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Functie <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="bijv. Directeur"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrijf</label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="(optioneel)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notitie</label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="(optioneel — bijv. context voor Claude)"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eoo-blue text-sm"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
          <button
            type="submit"
            disabled={adding}
            className="bg-eoo-blue text-white font-montserrat font-bold px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
          >
            {adding ? 'Toevoegen...' : '+ Contact toevoegen'}
          </button>
        </form>

        {/* Lijst */}
        {contacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400 text-sm">Nog geen bekende contacten.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-eoo-marine">Naam</th>
                  <th className="px-4 py-3 font-semibold text-eoo-marine">Functie</th>
                  <th className="px-4 py-3 font-semibold text-eoo-marine">Bedrijf</th>
                  <th className="px-4 py-3 font-semibold text-eoo-marine">Notitie</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => {
                  const isEditing = editingId === c.id
                  return (
                    <tr key={c.id} className="border-t border-gray-100">
                      {isEditing ? (
                        <>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={editDraft.name ?? c.name}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, name: e.target.value })
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={editDraft.role ?? c.role}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, role: e.target.value })
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={editDraft.company ?? c.company ?? ''}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, company: e.target.value })
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={editDraft.notes ?? c.notes ?? ''}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, notes: e.target.value })
                              }
                              className="w-full px-2 py-1 border border-gray-200 rounded"
                            />
                          </td>
                          <td className="px-4 py-2 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleSaveEdit(c.id)}
                              className="text-eoo-blue hover:underline mr-3"
                            >
                              Opslaan
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null)
                                setEditDraft({})
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              Annuleer
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-semibold text-eoo-marine">{c.name}</td>
                          <td className="px-4 py-3 text-gray-700">{c.role}</td>
                          <td className="px-4 py-3 text-gray-500">{c.company ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{c.notes ?? '—'}</td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setEditingId(c.id)
                                setEditDraft({})
                              }}
                              className="text-sm text-gray-600 hover:text-eoo-marine mr-3"
                            >
                              Bewerken
                            </button>
                            <button
                              onClick={() => handleDelete(c.id, c.name)}
                              className="text-sm text-red-400 hover:text-red-600"
                            >
                              Verwijderen
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
