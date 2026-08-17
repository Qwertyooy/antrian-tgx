// GET /api/queue - list all active queues (waiting + cooking)
export default defineEventHandler(async () => {
  return prisma.queue.findMany({
    where: { status: { in: ['waiting', 'cooking'] } },
    include: {
      items: { include: { menu: true } }
    },
    orderBy: { number: 'asc' }
  })
})
