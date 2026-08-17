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

    <main class="max-w-7xl mx-auto px-4 py-8">

      <!-- Tab Antrian / Menu -->
      <div class="flex gap-2 mb-6">
        <button v-for="tab in ['Antrian', 'Menu']" :key="tab" @click="activeTab = tab"
                class="px-5 py-2 rounded-xl text-sm font-semibold transition"
                :class="activeTab === tab ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'">
          {{ tab }}
        </button>
      </div>

      <!-- === TAB ANTRIAN === -->
      <template v-if="activeTab === 'Antrian'">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <!-- POS: Pilih Menu (kiri) -->
          <div class="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4">🛒 Pilih Menu Pesanan</h3>

            <!-- Nama Pelanggan -->
            <div class="mb-4">
              <input v-model="newCustomer" type="text" required placeholder="Nama pelanggan..."
                     class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 font-semibold" />
            </div>

            <!-- Category Tabs -->
            <div class="flex gap-2 mb-4">
              <button v-for="cat in categories" :key="cat" @click="selectedCategory = cat"
                      class="px-4 py-2 rounded-xl text-sm font-semibold transition"
                      :class="selectedCategory === cat ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">
                {{ cat === 'Martabak' ? '🫓' : '🥞' }} {{ cat }}
              </button>
            </div>

            <!-- Menu Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1">
              <div v-for="m in filteredMenus" :key="m.id"
                   @click="addToCart(m)"
                   class="p-3 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md active:scale-95"
                   :class="cart.some(c => c.menuId === m.id) ? 'border-amber-400 bg-amber-50' : 'border-slate-100 bg-slate-50 hover:border-amber-200'">
                <p class="font-bold text-sm text-slate-800 truncate">{{ m.name }}</p>
                <p class="text-xs text-amber-600 font-semibold mt-1">Rp{{ m.price.toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Cart + Submit (kanan) -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <h3 class="font-bold text-slate-900 mb-4">🧾 Pesanan</h3>

            <!-- Cart Items -->
            <div class="flex-1 space-y-2 mb-4 max-h-[300px] overflow-y-auto">
              <div v-if="!cart.length" class="text-center py-8 text-slate-400 text-sm">Pilih menu dari daftar</div>
              <div v-for="(item, idx) in cart" :key="idx"
                   class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-xs text-slate-800 truncate">{{ item.name }}</p>
                  <p class="text-xs text-slate-500">Rp{{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button @click.stop="changeQty(idx, -1)" class="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm font-bold flex items-center justify-center">−</button>
                  <span class="text-sm font-bold w-6 text-center">{{ item.quantity }}</span>
                  <button @click.stop="changeQty(idx, 1)" class="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold flex items-center justify-center">+</button>
                </div>
                <button @click.stop="removeFromCart(idx)" class="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-slate-200 pt-3 mb-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-slate-600">Total:</span>
                <span class="text-lg font-extrabold text-amber-700">Rp{{ cartTotal.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Submit -->
            <button @click="submitOrder" :disabled="!cart.length || !newCustomer"
                    class="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-md shadow-amber-600/20">
              Pesan Antrian ({{ cart.reduce((s, i) => s + i.quantity, 0) }} item)
            </button>
            <button v-if="cart.length" @click="clearCart" class="w-full mt-2 text-xs text-slate-400 hover:text-red-500 py-2 transition">
              Kosongkan Keranjang
            </button>
          </div>
        </div>

        <!-- Kontrol Panggilan -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div class="flex-1">
              <h3 class="font-bold text-slate-900 mb-2">📢 Kontrol Panggilan</h3>
              <div class="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <div class="text-3xl font-extrabold text-amber-700">{{ cooking?.number ?? '--' }}</div>
                <div>
                  <p class="text-xs text-amber-800 font-semibold uppercase">Sedang Dilayani</p>
                  <p class="text-sm text-slate-700 font-medium">
                    {{ cooking ? `${cooking.customer}` : 'Belum ada' }}
                  </p>
                  <p v-if="cooking" class="text-xs text-slate-500 mt-1">
                    {{ cooking.items.map(i => `${i.menu.name}×${i.quantity}`).join(', ') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
              <button @click="callNext" :disabled="!nextWaiting"
                      class="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl text-sm transition shadow-md">
                Panggil Berikutnya ➡️
              </button>
              <button @click="resetQueues" class="flex-1 md:flex-none bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-6 rounded-xl text-sm transition">
                Reset 🔄
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
                  <th class="py-3 px-4">Pesanan</th>
                  <th class="py-3 px-4">Total</th>
                  <th class="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-if="!queues.length"><td colspan="5" class="text-center py-8 text-slate-400">Belum ada antrian.</td></tr>
                <tr v-for="q in queues" :key="q.id">
                  <td class="py-3 px-4 font-bold text-amber-700">{{ q.number }}</td>
                  <td class="py-3 px-4 font-semibold">{{ q.customer }}</td>
                  <td class="py-3 px-4 text-slate-500 text-xs">
                    {{ q.items.map(i => `${i.menu.name}×${i.quantity}`).join(', ') }}
                  </td>
                  <td class="py-3 px-4 font-semibold text-amber-700">
                    Rp{{ queueTotal(q).toLocaleString() }}
                  </td>
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
                <label class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                <select v-model="newMenuCategory" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500">
                  <option value="Martabak">Martabak</option>
                  <option value="Terang Bulan">Terang Bulan</option>
                </select>
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

          <!-- Daftar Menu per Kategori -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 class="font-bold text-slate-900 mb-4">📋 Daftar Menu</h3>
            <div v-for="cat in categories" :key="cat" class="mb-4 last:mb-0">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{{ cat === 'Martabak' ? '🫓' : '🥞' }} {{ cat }}</p>
              <div class="space-y-2">
                <div v-for="m in menus.filter(x => x.category === cat)" :key="m.id"
                     class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm text-slate-800 truncate">{{ m.name }}</p>
                    <p class="text-xs text-slate-500">Rp{{ m.price.toLocaleString() }}</p>
                  </div>
                  <button @click="toggleMenu(m)" class="text-xs font-bold px-3 py-1 rounded-full transition"
                          :class="m.available ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-700 hover:bg-red-200'">
                    {{ m.available ? 'Aktif' : 'Off' }}
                  </button>
                  <button @click="deleteMenu(m.id)" class="text-xs text-red-400 hover:text-red-600">🗑️</button>
                </div>
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

const categories = computed(() => [...new Set(menus.value.map(m => m.category))])
const selectedCategory = ref('')

const cooking = computed(() => queues.value.find(q => q.status === 'cooking'))
const nextWaiting = computed(() => queues.value.find(q => q.status === 'waiting'))

const filteredMenus = computed(() =>
  menus.value.filter(m => m.category === selectedCategory.value && m.available)
)

// --- CART ---
const cart = ref([])
const newCustomer = ref('')

const cartTotal = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

function addToCart(menu) {
  const existing = cart.value.find(c => c.menuId === menu.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({ menuId: menu.id, name: menu.name, price: menu.price, quantity: 1 })
  }
}

function changeQty(idx, delta) {
  cart.value[idx].quantity += delta
  if (cart.value[idx].quantity <= 0) cart.value.splice(idx, 1)
}

function removeFromCart(idx) {
  cart.value.splice(idx, 1)
}

function clearCart() {
  cart.value = []
}

function queueTotal(q) {
  return q.items.reduce((sum, i) => sum + i.menu.price * i.quantity, 0)
}

// --- NEW MENU FORM ---
const newMenuName = ref('')
const newMenuCategory = ref('Martabak')
const newMenuPrice = ref(0)

// --- FETCH ---
async function fetchMenus() {
  menus.value = await $fetch('/api/menu')
  if (categories.value.length && !selectedCategory.value) {
    selectedCategory.value = categories.value[0]
  }
}
async function fetchQueues() { queues.value = await $fetch('/api/queue') }

// --- ACTIONS ---
async function submitOrder() {
  if (!cart.value.length || !newCustomer.value) return
  await $fetch('/api/queue', {
    method: 'POST',
    body: {
      customer: newCustomer.value,
      items: cart.value.map(c => ({ menuId: c.menuId, quantity: c.quantity }))
    }
  })
  newCustomer.value = ''
  cart.value = []
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
  await $fetch('/api/menu', {
    method: 'POST',
    body: { name: newMenuName.value, category: newMenuCategory.value, price: newMenuPrice.value }
  })
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
