// ── APP STATE ──
// Central state object. In Phase 4 (React), this becomes useState/Zustand.
// For now it's a plain module — import and mutate directly.

import { storage }         from './storage.js'
import { SAMPLE_PRODUCTS } from '../data/sampleProducts.js'

export const state = {
  storeName: '',
  lang:      'eng',
  dark:      false,

  // Deep-clone SAMPLE_PRODUCTS so mutations don't touch the original
  products:  [],
  salesLog:  {},   // { 'YYYY-MM-DD': { total, count, items[] } }

  cart:      [],   // [{ id, name, price, qty, size, cat }]

  // UI state
  activeView:  'products',   // products | customer | receipt | sales | reports
  activeTab:   'All',        // category filter
  chartPeriod: 'day',        // day | month | year
  searchQuery: '',           // product search
  receiptData: null,         // last completed transaction for print

  // Load from Supabase (called once on startup)
  async load() {
    this.storeName = storage.getStoreName()
    this.lang      = storage.getLang()
    this.dark      = storage.getDark()
    this.salesLog  = await storage.getSales()
    const saved    = await storage.getProducts()
    this.products  = saved.length > 0
      ? saved
      : JSON.parse(JSON.stringify(SAMPLE_PRODUCTS))
  },

  // Save settings to localStorage (products/sales saved to Supabase individually)
  save() {
    storage.setStoreName(this.storeName)
    storage.setLang(this.lang)
    storage.setDark(this.dark)
  },

  // Helpers
  todayTotal() {
    const today = new Date().toISOString().slice(0, 10)
    return (this.salesLog[today] || { total: 0 }).total || 0
  },
  cartQty()   { return this.cart.reduce((s, i) => s + i.qty, 0) },
  cartTotal() { return this.cart.reduce((s, i) => s + i.price * i.qty, 0) },
}