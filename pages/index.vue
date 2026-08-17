<template>
  <div class="min-h-screen bg-amber-50 text-slate-800 antialiased font-jakarta">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
        <h1 class="font-bold text-xl tracking-tight text-amber-900">Antrian-<span class="text-amber-500">TGX</span></h1>
      </div>
      <ul class="flex gap-6 font-medium text-sm text-slate-600">
        <li><NuxtLink to="/antrian" class="hover:text-amber-600 transition-colors">Lihat Antrian</NuxtLink></li>
        <li><NuxtLink to="/admin" class="hover:text-amber-600 transition-colors">Admin</NuxtLink></li>
      </ul>
    </nav>

    <!-- Hero -->
    <section class="min-h-screen w-full flex justify-center items-center px-4 pt-20">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-amber-900/5 border border-amber-100 overflow-hidden">
        <div class="h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative">
          <span class="text-6xl">🫓</span>
          <span class="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Buka
          </span>
        </div>
        <div class="p-6 flex flex-col items-center text-center">
          <h2 class="text-xl font-bold text-slate-800 mb-2">Martabak Depan Asrama Polisi</h2>
          <p class="text-sm text-slate-500 mb-6">Nikmati martabak legendaris dengan antrian real-time. Cek posisimu sekarang.</p>
          <NuxtLink to="/antrian" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2">
            <span>Lihat Antrian</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
