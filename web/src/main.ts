const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <div class="min-h-screen p-8 flex flex-col items-center justify-center gap-6">
    <header class="text-center">
      <h1 class="text-5xl mb-2">FAVO</h1>
      <p class="text-brand-light/60 font-medium">Agro Finance Manager</p>
    </header>

    <main class="w-full max-w-md bg-surface p-8 rounded-xl border border-border shadow-sm">
      <h2 class="text-2xl mb-4">Current Harvest</h2>
      <div class="flex items-end justify-between border-b border-border pb-4 mb-4">
        <span class="text-sm font-semibold uppercase tracking-wider text-brand-light/50">Total Profit</span>
        <span class="text-4xl font-serif text-brand-gold">1,250,000 <span class="text-xl">g</span></span>
      </div>

      <button class="w-full bg-brand-gold text-brand-white font-bold py-3 rounded-lg hover:brightness-90 transition-all">
        New Transaction
      </button>
    </main>

    <footer class="text-xs text-brand-light/40 italic">
      "The soil provides for those who wait."
    </footer>
  </div>
`
