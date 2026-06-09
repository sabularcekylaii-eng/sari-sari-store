// ── RECEIPT VIEW ──
import { state }       from '../utils/state.js'
import { t }           from '../utils/i18n.js'
import { formatMoney } from '../utils/formatters.js'

export function renderReceiptView() {
  return `
  <div id="vrec" class="view${state.activeView === 'receipt' ? ' active' : ''}">
    <div class="sec-hdr"><span class="sec-ttl">${t('receiptPrev').toUpperCase()}</span></div>
    <div id="recview">${state.receiptData ? buildReceiptHTML(state.receiptData) : ''}</div>
  </div>`
}

function buildReceiptHTML(d) {
  return `
  <div class="receipt-card">
    <div class="rc" style="font-size:16px;font-weight:700;margin-bottom:2px">🏪 ${d.storeName}</div>
    <div class="rc" style="font-size:10px;color:var(--text3);margin-bottom:5px">${d.date}</div>
    <hr class="rdash">
    ${d.items.map(i => `
      <div class="rrow"><span>${i.name}</span><span>${formatMoney(i.price)}</span></div>
      <div class="rrow" style="font-size:11px;color:var(--text3);padding-left:12px;margin-bottom:3px">
        <span>× ${i.qty}  ${i.size}</span><span>${formatMoney(i.price * i.qty)}</span>
      </div>`).join('')}
    <hr class="rdash">
    <div class="rrow" style="font-weight:700;font-size:15px;margin-bottom:4px">
      <span>${t('cartTotal')}</span>
      <span style="color:var(--accent);font-size:17px">${formatMoney(d.total)}</span>
    </div>
    <hr class="rdash">
    <div class="rc" style="font-size:11px;color:var(--text3)">${t('receiptThank')}</div>
  </div>

  <button onclick="app.doPrint()"
    style="width:100%;padding:12px;background:#1a1a1a;color:#fff;border:none;border-radius:var(--r);font-size:14px;font-weight:700;cursor:pointer;margin-bottom:9px">
    <i class="ti ti-printer" style="font-size:16px;vertical-align:-2px;margin-right:7px"></i>
    ${t('printBtn')}
  </button>

  <button onclick="app.newTransaction()" class="pri-btn" style="background:var(--green)">
    <i class="ti ti-check" style="font-size:16px;vertical-align:-2px;margin-right:7px"></i>
    ${t('newTxn')}
  </button>`
}

export function buildPrintArea(d) {
  const pa = document.getElementById('print-area')
  if (!pa) return
  pa.innerHTML = `
    <div class="pb">${d.storeName}</div>
    <div class="pd">${d.date}</div>
    <div class="pln"></div>
    ${d.items.map(i => `<div class="prow"><span>${i.name} ×${i.qty}</span><span>${formatMoney(i.price * i.qty)}</span></div>`).join('')}
    <div class="pln"></div>
    <div class="prow ptot"><span>TOTAL</span><span>${formatMoney(d.total)}</span></div>
    <div class="pft">${t('receiptThank')}</div>`
}
