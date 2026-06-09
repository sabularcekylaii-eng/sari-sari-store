// ── PRODUCTS VIEW ──
import { state }              from '../utils/state.js'
import { t }                  from '../utils/i18n.js'
import { formatMoney, esc }  from '../utils/formatters.js'
import { getCatEmoji, getCatLabel } from '../data/categories.js'
import { CATEGORIES }        from '../data/categories.js'

export function renderProductsView() {
  const low = state.products.filter(p => p.stock > 0 && p.stock <= p.lowAt).length
  const out = state.products.filter(p => p.stock === 0).length
  const cq  = state.cartQty()
  const ct  = state.cartTotal()

  return `
  <div id="vp" class="view${state.activeView === 'products' ? ' active' : ''}">
    ${renderStats(low, out)}
    ${renderSearchRow()}
    ${renderCatTabs()}
    ${renderSuggestions()}
    ${cq > 0 ? `
      <div class="cart-bar" onclick="app.switchView('customer')">
        <span style="font-size:13px;font-weight:600">
          <i class="ti ti-shopping-cart" style="font-size:15px;vertical-align:-2px;margin-right:6px"></i>
          ${cq} item${cq > 1 ? 's' : ''} in cart
        </span>
        <span style="font-size:15px;font-weight:700">${formatMoney(ct)}</span>
      </div>` : ''}
    <div id="prod-list">${renderProductList()}</div>
    <div style="height:80px"></div>
  </div>`
}

function renderStats(low, out) {
  return `
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-num">${state.products.length}</div><div class="stat-lbl">${t('statTotal')}</div></div>
    <div class="stat-card"><div class="stat-num red">${low}</div><div class="stat-lbl">${t('statLow')}</div></div>
    <div class="stat-card"><div class="stat-num red">${out}</div><div class="stat-lbl">${t('statOut')}</div></div>
    <div class="stat-card"><div class="stat-num green">${formatMoney(state.todayTotal())}</div><div class="stat-lbl">${t('statToday')}</div></div>
  </div>`
}

function renderSearchRow() {
  return `
  <div class="search-row">
    <div class="sbox">
      <i class="ti ti-search"></i>
      <input id="srch" placeholder="${t('srchPh')}"
        value="${state.searchQuery}"
        oninput="app.setSearch(this.value)">
    </div>
    <button class="add-btn" onclick="app.openAddModal()">
      <i class="ti ti-plus"></i> ${t('addProd')}
    </button>
  </div>`
}

function renderCatTabs() {
  const cats = ['All', ...new Set(state.products.map(p => p.cat))]
  if (state.activeTab !== 'All' && !cats.includes(state.activeTab)) state.activeTab = 'All'
  return `
  <div class="cat-tabs">
    ${cats.map(c => `
      <button class="ctab${state.activeTab === c ? ' active' : ''}" onclick="app.setTab('${c}')">
        ${c === 'All' ? t('all') : getCatEmoji(c) + ' ' + getCatLabel(c, state.lang)}
      </button>`).join('')}
  </div>`
}

function renderSuggestions() {
  const need = state.products.filter(p => p.stock <= p.lowAt).slice(0, 5)
  if (!need.length) return ''
  return `
  <div class="suggest-box">
    <div class="suggest-title">
      <i class="ti ti-bulb" style="font-size:15px;vertical-align:-2px;margin-right:5px"></i>
      ${t('suggestTitle')}
    </div>
    ${need.map(p => {
      const inCart = state.cart.find(i => i.id === p.id)
      return `
      <div class="suggest-item">
        <div>
          <div style="font-size:13px;font-weight:600">${getCatEmoji(p.cat)} ${p.name}</div>
          <div style="font-size:11px;color:var(--text3)">
            ${p.stock === 0 ? t('outWarn') : t('lowWarn') + ' (' + p.stock + ' left)'}
          </div>
        </div>
        <button class="pa info" onclick="app.addToCart(${p.id})">
          ${inCart ? t('inCart') : t('addCart')}
        </button>
      </div>`
    }).join('')}
  </div>`
}

export function renderProductList() {
  const q = state.searchQuery.toLowerCase()
  let list = state.products.filter(p => state.activeTab === 'All' || p.cat === state.activeTab)
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    getCatLabel(p.cat, state.lang).toLowerCase().includes(q)
  )
  list.sort((a, b) => a.stock - b.stock)

  if (!list.length) return `<div class="empty">${q ? 'No results found.' : 'No products yet. Click "Add Product" to get started.'}</div>`

  return `
  <div class="prod-grid">
    ${list.map(p => renderProductCard(p)).join('')}
  </div>`
}

function renderProductCard(p) {
  const cls   = p.stock === 0 ? 'out' : p.stock <= p.lowAt ? 'low' : ''
  const badge = p.stock === 0
    ? `<span class="stock-badge sb-out">${t('stockOut')}</span>`
    : p.stock <= p.lowAt
    ? `<span class="stock-badge sb-low">${t('stockLow')}</span>`
    : `<span class="stock-badge sb-ok">${t('stockOk')}</span>`
  const inCart = state.cart.find(i => i.id === p.id)

  return `
  <div class="pcard ${cls}">
    <div class="p-emoji">${getCatEmoji(p.cat)}</div>
    <div class="p-info">
      <div class="p-name">${p.name}</div>
      <div class="p-meta">${p.size} · ${getCatLabel(p.cat, state.lang)}</div>
      <div class="p-actions">
        <button class="pa" onclick="app.openEditModal(${p.id})">
          <i class="ti ti-edit"></i> ${t('editBtn')}
        </button>
        <button class="pa${p.stock === 0 ? ' danger' : ''}" onclick="app.sellOne(${p.id})">
          <i class="ti ti-minus"></i> ${t('sellBtn')}
        </button>
        <button class="pa${inCart ? ' success' : ' info'}" onclick="app.addToCart(${p.id})">
          ${inCart ? t('inCart') : t('addCart')}
        </button>
      </div>
    </div>
    <div class="p-right">
      <div class="p-price">${formatMoney(p.price)}</div>
      <div class="p-qty">${p.stock} ${t('qty')}</div>
      ${badge}
    </div>
  </div>`
}
