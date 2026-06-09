// ── LAYOUT: Topbar + Sidebar + Mobile Nav ──
import { state }        from '../utils/state.js'
import { t, setLang }  from '../utils/i18n.js'
import { storage }     from '../utils/storage.js'
import { render }      from '../main.js'

export function renderTopbar() {
  const cartQty = state.cartQty()
  return `
  <div class="topbar">
    <button class="store-btn" onclick="app.editStoreName()" title="${t('editName')}">
      <div class="s-icon"><i class="ti ti-home-2"></i></div>
      <div style="text-align:left">
        <div class="s-nm">${state.storeName}</div>
        <div class="s-sub"><i class="ti ti-edit" style="font-size:10px;vertical-align:-1px"></i> ${t('editName')}</div>
      </div>
    </button>
    <div class="tb-right">
      <button class="tb-btn" onclick="app.toggleLang()">${state.lang === 'fil' ? '🇺🇸 ENG' : '🇵🇭 FIL'}</button>
      <button class="icon-btn" onclick="app.toggleDark()" title="Toggle dark mode">
        ${state.dark ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>'}
      </button>
    </div>
  </div>`
}

export function renderSidebar() {
  const cq = state.cartQty()
  const navs = getNavItems(cq)
  return `
  <div class="sidebar">
    ${navs.map(n => `
      <button class="nav-item${state.activeView === n.id ? ' active' : ''}" onclick="app.switchView('${n.id}')">
        <i class="ti ${n.icon}"></i>${n.label}
        ${n.badge ? `<span class="nav-badge">${n.badge}</span>` : ''}
      </button>`).join('')}
  </div>`
}

export function renderMobileNav() {
  const cq = state.cartQty()
  const navs = getNavItems(cq)
  return `
  <div class="mob-nav">
    ${navs.map(n => `
      <button class="mn-item${state.activeView === n.id ? ' active' : ''}" onclick="app.switchView('${n.id}')">
        <i class="ti ${n.icon}"></i>
        <span>${n.label}${n.badge ? `<span class="mn-badge">${n.badge}</span>` : ''}</span>
      </button>`).join('')}
  </div>`
}

function getNavItems(cartQty) {
  return [
    { id: 'products', icon: 'ti-package',   label: t('prods') },
    { id: 'customer', icon: 'ti-users',     label: t('cust'), badge: cartQty || 0 },
    { id: 'sales',    icon: 'ti-cash',      label: t('sales') },
    { id: 'reports',  icon: 'ti-chart-bar', label: t('rpts') },
  ]
}
