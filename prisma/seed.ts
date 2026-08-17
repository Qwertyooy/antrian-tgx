import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.menu.count()
  if (count > 0) {
    console.log('Menus already seeded, skipping.')
    return
  }

  const menus = [
    { name: 'Martabak Manis Original', price: 25000 },
    { name: 'Martabak Manis Keju', price: 30000 },
    { name: 'Martabak Manis Coklat', price: 28000 },
    { name: 'Martabak Telur Spesial', price: 30000 },
    { name: 'Martabak Telur Biasa', price: 22000 },
  ]

  await prisma.menu.createMany({ data: menus })
  console.log('✅ Seeded', menus.length, 'menus')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
