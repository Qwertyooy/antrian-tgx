export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID wajib' })
  return prisma.menu.delete({ where: { id } })
})
