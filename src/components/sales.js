// ── SALES LOG VIEW ──
import { state }       from '../utils/state.js'
import { t }           from '../utils/i18n.js'
import { formatMoney } from '../utils/formatters.js'

export function renderSalesView() {
  const entries = Object.entries(state.salesLog)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 30)

  return `
  <div id="vs" class="view${state.activeView === 'sales' ? ' active' : ''}">
    <div class="sec-hdr"><span class="sec-ttl">SALES LOG</span></div>
    ${!entries.length
      ? `<div class="empty">${t('noSales')}</div>`
      : entries.map(([date, data]) => `
        <div class="log-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span style="font-size:14px;font-weight:700">${date}</span>
            <span style="font-size:16px;font-weight:700;color:var(--greentext)">${formatMoney(data.total || 0)}</span>
          </div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:5px">
            ${data.count || 0} ${t('txn')}${(data.count || 0) !== 1 ? 's' : ''}
          </div>
          ${(data.items || []).slice(0, 6).map(i => `
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);padding:1px 0">
              <span>${i.name} ×${i.qty}</span>
              <span>${formatMoney(i.price * i.qty)}</span>
            </div>`).join('')}
        </div>`).join('')}
    <div style="height:80px"></div>
  </div>`
}
