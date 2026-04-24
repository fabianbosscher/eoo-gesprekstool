import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@easyofficeonline.nl' },
    update: {},
    create: {
      email: 'admin@easyofficeonline.nl',
      name: 'Easy Office Online',
      password,
    },
  })

  console.log('Seed voltooid. Admin gebruiker aangemaakt:')
  console.log(`  E-mail: ${user.email}`)
  console.log(`  Wachtwoord: admin123`)
  console.log('Wijzig dit wachtwoord na de eerste login!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
