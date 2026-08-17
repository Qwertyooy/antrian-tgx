<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-800 antialiased font-jakarta">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-md border-b border-amber-200/50 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md">M</div>
        <div>
          <h1 class="font-extrabold text-lg tracking-tight text-slate-900">Martabak <span class="text-amber-600">TGX</span></h1>
          <p class="text-xs text-slate-500 font-medium">Sistem Antrian Live</p>
        </div>
      </div>
      <NuxtLink to="/" class="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">← Beranda</NuxtLink>
    </nav>

    <main class="max-w-4xl mx-auto px-4 pt-28 pb-16">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-8 text-white shadow-xl mb-8 text-center relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <span class="bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Depan Asrama Polisi</span>
        <h2 class="text-3xl md:text-4xl font-extrabold mb-2">Status Antrian Hari Ini</h2>
        <p class="text-amber-100 text-sm max-w-md mx-auto">Pantau nomor antrian pesananmu secara real-time.</p>
      </div>

      <!-- Current Queue + Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Sedang Diproses -->
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-amber-100 text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <span class="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Sedang Dimasak 🍳</span>
          <div class="text-6xl md:text-7xl font-extrabold text-slate-900 my-6 tracking-tight">
            {{ cooking?.number ?? '--' }}
          </div>
          <p class="text-sm text-slate-600 font-semibold bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-100">
            {{ cooking ? `${cooking.customer} — ${cooking.menu.name}` : 'Menunggu panggilan...' }}
          </p>
        </div>

        <!-- Info Panel -->
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Informasi</span>
            <span class="text-xs font-bold text-slate-500">Total: {{ queues.length }} Antrian</span>
          </div>
          <div class="space-y-3">
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-500">Nomor Berikutnya:</span>
              <span class="text-lg font-bold text-slate-800">{{ nextWaiting?.number ?? '--' }}</span>
            </div>
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-500">Sisa Antrian:</span>
              <span class="text-sm font-bold text-amber-600">{{ waitingCount }} antrian</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-100 text-center">
            <span class="text-xs text-slate-400">Silakan siap di tempat saat nomor mendekati giliran.</span>
          </div>
        </div>
      </div>

      <!-- Daftar Antrian -->
      <div class="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-amber-100">
        <h3 class="font-extrabold text-lg text-slate-900 mb-4 flex items-center justify-between">
          <span>Daftar Antrian Aktif</span>
          <span class="text-xs font-semibold text-slate-400">Auto-refresh</span>
        </h3>
        <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
          <div v-if="!queues.length" class="text-center py-8 text-slate-400 text-sm">Belum ada antrian hari ini.</div>
          <div v-for="q in queues" :key="q.id"
               class="flex items-center gap-4 p-4 rounded-2xl border transition-all"
               :class="q.status === 'cooking' ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-300' : 'bg-slate-50 border-slate-100'">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg"
                 :class="q.status === 'cooking' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'">
              {{ q.number }}
            </div>
            <div class="flex-1">
              <p class="font-bold text-sm text-slate-800">{{ q.customer }}</p>
              <p class="text-xs text-slate-500">{{ q.menu.name }}</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full"
                  :class="q.status === 'cooking' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'">
              {{ q.status === 'cooking' ? '🍳 Masak' : '⏳ Antri' }}
            </span>
          </div>
        </div>
      </div>
    </main>

    <footer class="text-center py-6 text-xs text-slate-500 border-t border-amber-200/30">
      © 2026 Antrian-TGX • Martabak Legendaris Depan Asrama Polisi Trenggalek
    </footer>
  </div>
</template>

<script setup>
const queues = ref([])

const cooking = computed(() => queues.value.find(q => q.status === 'cooking'))
const nextWaiting = computed(() => queues.value.find(q => q.status === 'waiting'))
const waitingCount = computed(() => queues.value.filter(q => q.status === 'waiting').length)

async function fetchQueues() {
  try {
    queues.value = await $fetch('/api/queue')
  } catch (e) {
    console.error('Gagal fetch antrian:', e)
  }
}

onMounted(() => {
  fetchQueues()
  // Auto-refresh every 5 seconds
  setInterval(fetchQueues, 5000)
})

useHead({ title: 'Antrian Real-Time | Martabak TGX' })
</script>
