<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 antialiased font-jakarta">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 px-6 md:px-12 py-4 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 bg-amber-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md">A</div>
        <div>
          <h1 class="font-extrabold text-base tracking-tight text-slate-900">Dashboard Admin</h1>
          <p class="text-xs text-slate-500">Kelola Antrian Martabak TGX</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/antrian" target="_blank" class="text-xs font-semibold px-4 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition border border-amber-200">🔗 Layar Publik</NuxtLink>
        <button @click="logout" class="text-xs font-semibold px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-200">🚪 Keluar</button>
      </div>
    </nav>

    <main class="max-w-6xl mx-auto px-4 py-8">

      <!-- Tab Menu / Antrian -->
      <div class="flex gap-2 mb-6">
        <button v-for="tab in ['Antrian', 'Menu']" :key="tab" @click="activeTab = tab"
                class="px-5 py-2 rounded-xl text-sm font-semibold transition"
                :class="activeTab === tab ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'">
          {{ tab }}
        </button>
      </div>

      <!-- === TAB ANTRIAN === -->
      <template v-if="activeTab === 'Antrian'">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Tambah Antrian -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4">➕ Tambah Antrian</h3>
            <form @submit.prevent="addQueue" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Pelanggan</label>
                <input v-model="newCustomer" type="text" required placeholder="Contoh: Budi"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Pilih Menu</label>
                <select v-model="newMenuId" required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500">
                  <option value="" disabled>Pilih menu...</option>
                  <option v-for="m in menus" :key="m.id" :value="m.id">{{ m.name }} — Rp{{ m.price.toLocaleString() }}</option>
                </select>
              </div>
              <button type="submit" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-md shadow-amber-600/20">
                Ambil Nomor Antrian
              </button>
            </form>
          </div>

          <!-- Kontrol Panggilan -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-slate-900 mb-4">📢 Kontrol Panggilan</h3>
              <div class="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-4">
                <div class="text-3xl font-extrabold text-amber-700">{{ cooking?.number ?? '--' }}</div>
                <div>
                  <p class="text-xs text-amber-800 font-semibold uppercase">Sedang Dilayani</p>
                  <p class="text-sm text-slate-700 font-medium">{{ cooking ? `${cooking.customer} — ${cooking.menu.name}` : 'Belum ada' }}</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button @click="callNext" :disabled="!nextWaiting"
                      class="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                Panggil Berikutnya ➡️
              </button>
              <button @click="resetQueues" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition">
                Reset Hari Ini 🔄
              </button>
            </div>
          </div>
        </div>

        <!-- Tabel Antrian -->
        <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 class="font-extrabold text-lg text-slate-900 mb-4">Daftar Seluruh Antrian</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th class="py-3 px-4">No</th>
                  <th class="py-3 px-4">Pelanggan</th>
                  <th class="py-3 px-4">Menu</th>
                  <th class="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-if="!queues.length"><td colspan="4" class="text-center py-8 text-slate-400">Belum ada antrian.</td></tr>
                <tr v-for="q in queues" :key="q.id">
                  <td class="py-3 px-4 font-bold text-amber-700">{{ q.number }}</td>
                  <td class="py-3 px-4">{{ q.customer }}</td>
                  <td class="py-3 px-4 text-slate-500">{{ q.menu.name }}</td>
                  <td class="py-3 px-4">
                    <span class="text-xs font-bold px-3 py-1 rounded-full"
                          :class="{
                            'bg-amber-100 text-amber-700': q.status === 'cooking',
                            'bg-blue-100 text-blue-700': q.status === 'waiting',
                            'bg-emerald-100 text-emerald-700': q.status === 'done'
                          }">
                      {{ q.status === 'cooking' ? '🍳 Masak' : q.status === 'waiting' ? '⏳ Antri' : '✅ Selesai' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- === TAB MENU === -->
      <template v-if="activeTab === 'Menu'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tambah Menu -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4">➕ Tambah Menu Baru</h3>
            <form @submit.prevent="addMenu" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Nama Menu</label>
                <input v-model="newMenuName" type="text" required placeholder="Contoh: Martabak Coklat"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Harga (Rp)</label>
                <input v-model.number="newMenuPrice" type="number" min="0" placeholder="25000"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
              </div>
              <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition shadow-md">
                Tambah Menu
              </button>
            </form>
          </div>

          <!-- Daftar Menu -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4">📋 Daftar Menu</h3>
            <div class="space-y-3">
              <div v-for="m in menus" :key="m.id"
                   class="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <div class="flex-1">
                  <p class="font-bold text-sm text-slate-800">{{ m.name }}</p>
                  <p class="text-xs text-slate-500">Rp{{ m.price.toLocaleString() }}</p>
                </div>
                <button @click="toggleMenu(m)" class="text-xs font-bold px-3 py-1 rounded-full transition"
                        :class="m.available ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'">
                  {{ m.available ? 'Aktif' : 'Nonaktif' }}
                </button>
                <button @click="deleteMenu(m.id)" class="text-xs text-red-400 hover:text-red-600">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup>
const router = useRouter()
const activeTab = ref('Antrian')

// Auth guard
onMounted(() => {
  const token = localStorage.getItem('admin_token')
  if (!token) router.push('/admin/login')
})

function logout() {
  localStorage.removeItem('admin_token')
  router.push('/admin/login')
}

// --- DATA ---
const menus = ref([])
const queues = ref([])

const cooking = computed(() => queues.value.find(q => q.status === 'cooking'))
const nextWaiting = computed(() => queues.value.find(q => q.status === 'waiting'))

// New queue form
const newCustomer = ref('')
const newMenuId = ref('')

// New menu form
const newMenuName = ref('')
const newMenuPrice = ref(0)

// --- FETCH ---
async function fetchMenus() { menus.value = await $fetch('/api/menu') }
async function fetchQueues() { queues.value = await $fetch('/api/queue') }

// --- ACTIONS ---
async function addQueue() {
  await $fetch('/api/queue', { method: 'POST', body: { customer: newCustomer.value, menuId: newMenuId.value } })
  newCustomer.value = ''
  newMenuId.value = ''
  fetchQueues()
}

async function callNext() {
  if (!nextWaiting.value) return
  await $fetch('/api/queue', { method: 'PATCH', body: { id: nextWaiting.value.id, status: 'cooking' } })
  fetchQueues()
}

async function resetQueues() {
  if (!confirm('Reset semua antrian hari ini?')) return
  await $fetch('/api/queue', { method: 'DELETE' })
  fetchQueues()
}

async function addMenu() {
  await $fetch('/api/menu', { method: 'POST', body: { name: newMenuName.value, price: newMenuPrice.value } })
  newMenuName.value = ''
  newMenuPrice.value = 0
  fetchMenus()
}

async function toggleMenu(m) {
  await $fetch('/api/menu', { method: 'PUT', body: { id: m.id, available: !m.available } })
  fetchMenus()
}

async function deleteMenu(id) {
  if (!confirm('Hapus menu ini?')) return
  await $fetch(`/api/menu/${id}`, { method: 'DELETE' })
  fetchMenus()
}

onMounted(() => {
  fetchMenus()
  fetchQueues()
})

useHead({ title: 'Dashboard Admin | Antrian-TGX' })
</script>
