// ── MAIN ENTRY POINT ──
// This file wires everything together.
// Think of it as the "controller" — it owns state mutations
// and delegates rendering to components.

import './styles/main.css'
import { state }          from './utils/state.js'
import { t, setLang }     from './utils/i18n.js'
import { storage }        from './utils/storage.js'
import { todayKey, nextId } from './utils/formatters.js'

import { renderSetupScreen }   from './components/setup.js'
import { renderTopbar, renderSidebar, renderMobileNav } from './components/layout.js'
import { renderProductsView }  from './components/products.js'
import { renderCustomerView }  from './components/customer.js'
import { renderReceiptView, buildPrintArea } from './components/receipt.js'
import { renderSalesView }     from './components/sales.js'
import { renderReportsView, renderChart } from './components/reports.js'
import {
  showModal, closeModal, closeBgClick,
  openAddModal, openEditModal,
  renderProductSearchResults, fillProductForm, resetProductSearch,
  getSelectedCat, selectCat,
} from './components/modal.js'

// Load saved data on startup
await state.load()
setLang(state.lang)

// ── RENDER ──
export function render() {
  document.body.dataset.dark = state.dark
  const root = document.getElementById('root')

  if (!state.storeName) {
    root.innerHTML = renderSetupScreen()
    setTimeout(() => {
      const i = document.getElementById('sname')
      if (i) { i.focus(); i.onkeydown = e => { if (e.key === 'Enter') app.confirmStoreName() } }
    }, 20)
    return
  }

  root.innerHTML = `
  ${renderTopbar()}
  <div class="main-area">
    ${renderSidebar()}
    <div class="content" id="content">
      ${renderProductsView()}
      ${renderCustomerView()}
      ${renderReceiptView()}
      ${renderSalesView()}
      ${renderReportsView()}
    </div>
  </div>
  ${renderMobileNav()}

  <!-- MODAL OVERLAY -->
  <div class="modal-overlay" id="mover" onclick="app.closeBgClick(event)">
    <div class="modal-box" id="mbox"></div>
  </div>

  <!-- PRINT AREA (hidden except when printing) -->
  <div id="print-area"></div>`

  if (state.activeView === 'reports') setTimeout(renderChart, 80)
  if (state.activeView === 'receipt' && state.receiptData) buildPrintArea(state.receiptData)
}

// ── APP ACTIONS (exposed to HTML via window.app) ──
window.app = {
  // ── SETUP ──
  confirmStoreName() {
    const v = (document.getElementById('sname')?.value || '').trim()
    if (!v) return
    state.storeName = v
    state.save()
    render()
  },

  setLang(lang) {
    state.lang = lang
    setLang(lang)
    state.save()
    render()
  },

  // ── NAVIGATION ──
  switchView(view) {
    state.activeView = view
    render()
    if (view === 'reports') setTimeout(renderChart, 80)
  },

  // ── TOPBAR ──
  editStoreName() {
    const n = prompt(t('setupTitle'), state.storeName)
    if (n && n.trim()) { state.storeName = n.trim(); state.save(); render() }
  },

  toggleLang() {
    state.lang = state.lang === 'fil' ? 'eng' : 'fil'
    setLang(state.lang)
    state.save()
    render()
  },

  toggleDark() {
    state.dark = !state.dark
    state.save()
    document.body.dataset.dark = state.dark
    const btn = document.querySelector('.topbar .icon-btn')
    if (btn) btn.innerHTML = state.dark ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>'
  },

  // ── PRODUCTS ──
  async setSearch(q) {
    state.searchQuery = q
    document.getElementById('prod-list').innerHTML =
      (await import('./components/products.js')).renderProductList()
  },

  setTab(cat) {
    state.activeTab = cat
    render()
  },

  setPeriod(period) {
    state.chartPeriod = period
    render()
  },

  async sellOne(id) {
    const p = state.products.find(x => x.id === id)
    if (!p || p.stock <= 0) return
    p.stock--
    const td = todayKey()
    if (!state.salesLog[td]) state.salesLog[td] = { total: 0, count: 0, items: [] }
    state.salesLog[td].total  = Math.round((state.salesLog[td].total  || 0) + p.price)
    state.salesLog[td].count  = (state.salesLog[td].count  || 0) + 1
    state.salesLog[td].items.push({ name: p.name, qty: 1, price: p.price, time: new Date().toLocaleTimeString() })
    // Save to Supabase
    await storage.updateProduct(p.id, { stock: p.stock })
    await storage.addSale({ total: p.price, items: state.salesLog[td].items })
    state.save()
    render()
  },

  // ── CART ──
  addToCart(id) {
    const p = state.products.find(x => x.id === id)
    if (!p || p.stock === 0) return
    const ex = state.cart.find(i => i.id === id)
    if (ex) { if (ex.qty < p.stock) ex.qty++ }
    else state.cart.push({ id: p.id, name: p.name, price: p.price, qty: 1, size: p.size, cat: p.cat })
    render()
  },

  changeQty(id, delta) {
    const ci = state.cart.find(i => i.id === id)
    const p  = state.products.find(x => x.id === id)
    if (!ci) return
    ci.qty += delta
    if (ci.qty <= 0) state.cart = state.cart.filter(i => i.id !== id)
    else if (p && ci.qty > p.stock) ci.qty = p.stock
    render()
  },

  clearCart() { state.cart = []; render() },

  // ── CHECKOUT ──
  async doCheckout() {
    if (!state.cart.length) return
    const total = state.cartTotal()
    const td    = todayKey()
    if (!state.salesLog[td]) state.salesLog[td] = { total: 0, count: 0, items: [] }
    state.salesLog[td].total  = Math.round((state.salesLog[td].total  || 0) + total)
    state.salesLog[td].count  = (state.salesLog[td].count  || 0) + 1
    state.cart.forEach(ci => {
      state.salesLog[td].items.push({ name: ci.name, qty: ci.qty, price: ci.price, time: new Date().toLocaleTimeString() })
      const p = state.products.find(x => x.id === ci.id)
      if (p) p.stock = Math.max(0, p.stock - ci.qty)
    })
    // Save to Supabase
    await storage.addSale({ total, items: state.salesLog[td].items })
    await Promise.all(
      state.cart.map(ci => {
        const p = state.products.find(x => x.id === ci.id)
        return p ? storage.updateProduct(p.id, { stock: p.stock }) : Promise.resolve()
      })
    )
    state.receiptData = {
      items:     [...state.cart],
      total,
      date:      new Date().toLocaleString(),
      storeName: state.storeName,
    }
    state.cart = []
    state.activeView = 'receipt'
    state.save()
    render()
    buildPrintArea(state.receiptData)
  },

  doPrint()        { window.print() },
  newTransaction() { state.receiptData = null; state.activeView = 'products'; render() },

  // ── MODALS ──
  openAddModal,
  openEditModal,
  closeModal,
  closeBgClick,
  selectCat,

  onProductSearch(q) { renderProductSearchResults(q) },
  fillProductForm(data, focusPrice) { fillProductForm(data, focusPrice) },
  resetProductSearch() { resetProductSearch() },

  async saveNewProduct() {
    const name = (document.getElementById('m-name')?.value || '').trim()
    if (!name) return
    const newProduct = {
      id:    nextId(state.products),
      name,
      size:  (document.getElementById('m-size')?.value  || '').trim() || '—',
      price: parseFloat(document.getElementById('m-price')?.value) || 0,
      stock: parseInt(document.getElementById('m-stock')?.value)   || 0,
      lowAt: parseInt(document.getElementById('m-low')?.value)     || 5,
      cat:   getSelectedCat('add-cg'),
    }
    state.products.push(newProduct)
    await storage.addProduct(newProduct)
    closeModal()
    render()
  },

  async saveEditProduct() {
    const p = state.products.find(x => x.id === state._editingId)
    if (!p) return
    p.name  = document.getElementById('m-name')?.value.trim()  || p.name
    p.size  = document.getElementById('m-size')?.value.trim()  || '—'
    p.price = parseFloat(document.getElementById('m-price')?.value) || 0
    p.stock = parseInt(document.getElementById('m-stock')?.value)   || 0
    p.lowAt = parseInt(document.getElementById('m-low')?.value)     || 5
    p.cat   = getSelectedCat('edit-cg')
    await storage.updateProduct(p.id, p)
    closeModal()
    render()
  },

  async deleteProduct() {
    await storage.deleteProduct(state._editingId)
    state.products = state.products.filter(p => p.id !== state._editingId)
    state.cart     = state.cart.filter(i => i.id !== state._editingId)
    closeModal()
    render()
  },
}

// ── BOOT ──
render()