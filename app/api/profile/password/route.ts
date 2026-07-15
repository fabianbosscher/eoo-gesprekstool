import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

  const userId = (session.user as { id?: string }).id!
  const { currentPassword, newPassword } = await req.json()

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return NextResponse.json({ error: 'Ongeldig verzoek' }, { status: 400 })
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'Nieuw wachtwoord moet minimaal 8 tekens zijn' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })

  const currentMatch = await bcrypt.compare(currentPassword, user.password)
  if (!currentMatch) {
    return NextResponse.json({ error: 'Huidig wachtwoord is onjuist' }, { status: 401 })
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: userId },
    data: { password: newHash },
  })

  return NextResponse.json({ success: true })
}
