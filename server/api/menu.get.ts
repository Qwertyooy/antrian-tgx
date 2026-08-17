export default defineEventHandler(async () => {
  return prisma.menu.findMany({ orderBy: { id: 'asc' } })
})
