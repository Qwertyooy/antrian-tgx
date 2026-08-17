import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  // Simple password check — change ADMIN_PASSWORD in .env for production
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  if (password !== adminPassword) {
    throw createError({ statusCode: 401, message: 'Password salah' })
  }

  // Generate simple token (not JWT, just for basic gating)
  const token = crypto.randomBytes(32).toString('hex')
  // In production, store token server-side or use JWT
  return { ok: true, token }
})
