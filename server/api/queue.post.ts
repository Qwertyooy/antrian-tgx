// POST /api/queue - add new queue entry
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { customer, menuId } = body

  if (!customer || !menuId) throw createError({ statusCode: 400, message: 'Nama dan menu wajib diisi' })

  // Get next queue number for today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastQueue = await prisma.queue.findFirst({
    where: { createdAt: { gte: today } },
    orderBy: { number: 'desc' }
  })

  const nextNumber = lastQueue ? lastQueue.number + 1 : 1

  return prisma.queue.create({
    data: { number: nextNumber, customer, menuId: Number(menuId) },
    include: { menu: true }
  })
})
