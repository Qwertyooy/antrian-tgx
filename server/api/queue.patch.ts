// PATCH /api/queue - update queue status
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, status } = body

  if (!id || !status) throw createError({ statusCode: 400, message: 'ID dan status wajib' })

  // If setting to "cooking", mark current cooking as "done" first
  if (status === 'cooking') {
    await prisma.queue.updateMany({
      where: { status: 'cooking' },
      data: { status: 'done' }
    })
  }

  return prisma.queue.update({
    where: { id: Number(id) },
    data: { status },
    include: {
      items: { include: { menu: true } }
    }
  })
})
