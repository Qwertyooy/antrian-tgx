import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.menu.count()
  if (count > 0) {
    console.log('Menus already seeded, skipping.')
    return
  }

  const menus = [
    // Martabak
    { name: 'Martabak Manis Original', category: 'Martabak', price: 25000 },
    { name: 'Martabak Manis Keju', category: 'Martabak', price: 30000 },
    { name: 'Martabak Manis Coklat', category: 'Martabak', price: 28000 },
    { name: 'Martabak Manis Kacang', category: 'Martabak', price: 25000 },
    { name: 'Martabak Manis Coklat Keju', category: 'Martabak', price: 32000 },
    { name: 'Martabak Telur Spesial', category: 'Martabak', price: 30000 },
    { name: 'Martabak Telur Biasa', category: 'Martabak', price: 22000 },
    { name: 'Martabak Telur Keju', category: 'Martabak', price: 33000 },
    // Terang Bulan
    { name: 'Terang Bulan Original', category: 'Terang Bulan', price: 20000 },
    { name: 'Terang Bulan Keju', category: 'Terang Bulan', price: 25000 },
    { name: 'Terang Bulan Coklat', category: 'Terang Bulan', price: 23000 },
    { name: 'Terang Bulan Kacang', category: 'Terang Bulan', price: 20000 },
    { name: 'Terang Bulan Coklat Keju', category: 'Terang Bulan', price: 28000 },
    { name: 'Terang Bulan Spesial', category: 'Terang Bulan', price: 30000 },
  ]

  await prisma.menu.createMany({ data: menus })
  console.log('✅ Seeded', menus.length, 'menus')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
