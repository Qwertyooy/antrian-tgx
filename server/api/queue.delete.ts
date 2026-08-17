// DELETE /api/queue - reset today's queues
export default defineEventHandler(async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return prisma.queue.deleteMany({
    where: { createdAt: { gte: today } }
  })
})
