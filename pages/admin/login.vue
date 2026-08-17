<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4 text-slate-800 font-jakarta">
    <div class="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-amber-100 space-y-6">
      <div class="text-center space-y-2">
        <div class="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md font-bold text-xl">🔒</div>
        <h1 class="text-2xl font-extrabold text-slate-900">Login Admin</h1>
        <p class="text-xs text-slate-500">Masuk untuk mengontrol sistem antrian.</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Password Admin</label>
          <input v-model="password" type="password" required placeholder="••••••••"
                 class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
        </div>
        <p v-if="error" class="text-red-500 text-xs">{{ error }}</p>
        <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md">
          Masuk ke Dashboard
        </button>
      </form>

      <div class="text-center pt-2">
        <NuxtLink to="/" class="text-xs text-slate-400 hover:text-slate-600 font-medium">← Kembali ke Beranda</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  error.value = ''
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value }
    })
    if (res.ok) {
      localStorage.setItem('admin_token', res.token)
      router.push('/admin')
    }
  } catch (e) {
    error.value = 'Password salah'
  }
}

useHead({ title: 'Login Admin | Antrian-TGX' })
</script>
