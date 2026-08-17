export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, name, price, available } = body

  if (!id) throw createError({ statusCode: 400, message: 'ID wajib' })

  return prisma.menu.update({
    where: { id: Number(id) },
    data: {
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price: Number(price) }),
      ...(available !== undefined && { available: Boolean(available) })
    }
  })
})
