export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, price, image } = body

  if (!name) throw createError({ statusCode: 400, message: 'Nama menu wajib diisi' })

  return prisma.menu.create({
    data: { name, price: Number(price) || 0, image: image || null }
  })
})
