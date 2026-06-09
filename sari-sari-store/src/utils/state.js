// ── APP STATE ──
// Central state object. In Phase 4 (React), this becomes useState/Zustand.
// For now it's a plain module — import and mutate directly.

import { storage }       from './storage.js'
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
  activeView: 'products',   // products | customer | receipt | sales | reports
  activeTab:  'All',        // category filter
  chartPeriod:'day',        // day | month | year
  searchQuery: '',          // product search
  receiptData: null,        // last completed transaction for print

  // Load from localStorage (called once on startup)
  load() {
    this.storeName = storage.getStoreName()
    this.lang      = storage.getLang()
    this.dark      = storage.getDark()
    this.salesLog  = storage.getSales()
    const saved    = storage.getProducts()
    this.products  = saved
      ? JSON.parse(JSON.stringify(saved))
      : JSON.parse(JSON.stringify(SAMPLE_PRODUCTS))
  },

  // Persist to localStorage
  save() {
    storage.saveAll({
      storeName: this.storeName,
      lang:      this.lang,
      dark:      this.dark,
      products:  this.products,
      sales:     this.salesLog,
    })
  },

  // Helpers
  todayTotal() {
    const today = new Date().toISOString().slice(0, 10)
    return (this.salesLog[today] || { total: 0 }).total || 0
  },
  cartQty()   { return this.cart.reduce((s, i) => s + i.qty, 0) },
  cartTotal() { return this.cart.reduce((s, i) => s + i.price * i.qty, 0) },
}
