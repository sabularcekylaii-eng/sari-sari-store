// ── CUSTOMER / CART VIEW ──
import { state }             from '../utils/state.js'
import { t }                 from '../utils/i18n.js'
import { formatMoney }       from '../utils/formatters.js'
import { getCatEmoji, getCatLabel } from '../data/categories.js'

export function renderCustomerView() {
  const cq = state.cartQty()
  const ct = state.cartTotal()

  return `
  <div id="vc" class="view${state.activeView === 'customer' ? ' active' : ''}">
    <div class="sec-hdr">
      <span class="sec-ttl">CUSTOMER CART</span>
      ${cq > 0 ? `<button class="pa danger" onclick="app.clearCart()"><i class="ti ti-trash"></i> ${t('clearCart')}</button>` : ''}
    </div>

    ${renderCartItems()}

    ${cq > 0 ? `
      <div class="total-bar">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text3);margin-bottom:5px">
          <span>Subtotal (${cq} item${cq > 1 ? 's' : ''})</span>
          <span>${formatMoney(ct)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:var(--accent)">
          <span>${t('cartTotal')}</span>
          <span>${formatMoney(ct)}</span>
        </div>
      </div>
      <button class="pri-btn" style="font-size:15px;padding:13px" onclick="app.doCheckout()">
        <i class="ti ti-receipt" style="font-size:17px;vertical-align:-2px;margin-right:7px"></i>
        ${t('checkout')}
      </button>` : ''}

    <div style="margin-top:18px">
      <div class="sec-hdr"><span class="sec-ttl">${t('availProds').toUpperCase()}</span></div>
      ${renderAvailableProducts()}
    </div>
    <div style="height:80px"></div>
  </div>`
}

function renderCartItems() {
  if (!state.cart.length) {
    return `<div class="cart-block"><div class="empty" style="padding:20px">${t('cartEmpty')}</div></div>`
  }
  return `
  <div class="cart-block">
    ${state.cart.map(ci => `
      <div class="cart-row">
        <div style="font-size:22px;width:30px;text-align:center;flex-shrink:0">${getCatEmoji(ci.cat)}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ci.name}</div>
          <div style="font-size:11px;color:var(--text3)">${formatMoney(ci.price)} each · ${ci.size}</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="app.changeQty(${ci.id}, -1)">−</button>
          <span class="qty-num">${ci.qty}</span>
          <button class="qty-btn" onclick="app.changeQty(${ci.id}, 1)">+</button>
        </div>
        <div style="font-size:14px;font-weight:700;color:var(--accent);min-width:52px;text-align:right">
          ${formatMoney(ci.price * ci.qty)}
        </div>
      </div>`).join('')}
  </div>`
}

function renderAvailableProducts() {
  const avail = state.products.filter(p => p.stock > 0)
  if (!avail.length) return `<div class="empty">No products in stock.</div>`
  return `
  <div class="prod-grid">
    ${avail.map(p => {
      const inCart = state.cart.find(i => i.id === p.id)
      return `
      <div class="pcard">
        <div class="p-emoji">${getCatEmoji(p.cat)}</div>
        <div class="p-info">
          <div class="p-name">${p.name}</div>
          <div class="p-meta">${p.size} · ${getCatLabel(p.cat, state.lang)}</div>
        </div>
        <div class="p-right">
          <div class="p-price">${formatMoney(p.price)}</div>
          <div class="p-qty">${p.stock} left</div>
          <button class="pa${inCart ? ' success' : ' info'}" style="margin-top:5px" onclick="app.addToCart(${p.id})">
            ${inCart ? t('inCart') : t('addCart')}
          </button>
        </div>
      </div>`
    }).join('')}
  </div>`
}
