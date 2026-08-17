// POST /api/queue - add new queue entry with multiple items
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { customer, items } = body

  if (!customer || !items?.length) {
    throw createError({ statusCode: 400, message: 'Nama dan minimal 1 item wajib diisi' })
  }

  // Get next queue number for today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastQueue = await prisma.queue.findFirst({
    where: { createdAt: { gte: today } },
    orderBy: { number: 'desc' }
  })

  const nextNumber = lastQueue ? lastQueue.number + 1 : 1

  // Create queue with items
  return prisma.queue.create({
    data: {
      number: nextNumber,
      customer,
      items: {
        create: items.map((item: any) => ({
          menuId: Number(item.menuId),
          quantity: Number(item.quantity) || 1
        }))
      }
    },
    include: {
      items: { include: { menu: true } }
    }
  })
})
