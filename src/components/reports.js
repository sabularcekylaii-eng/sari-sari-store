// ── REPORTS / CHARTS VIEW ──
import { state }       from '../utils/state.js'
import { t }           from '../utils/i18n.js'
import { formatMoney } from '../utils/formatters.js'

let salesChart = null

export function renderReportsView() {
  const allRevenue = Object.values(state.salesLog).reduce((s, d) => s + (d.total || 0), 0)
  const allTxn     = Object.values(state.salesLog).reduce((s, d) => s + (d.count || 0), 0)

  const dailyEntries = Object.entries(state.salesLog)
    .sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14)

  return `
  <div id="vr" class="view${state.activeView === 'reports' ? ' active' : ''}">
    <div class="chart-card">
      <div style="font-size:15px;font-weight:700;margin-bottom:10px">${t('allTime')} Chart</div>
      <div class="period-tabs">
        <button class="ptab${state.chartPeriod === 'day'   ? ' active' : ''}" onclick="app.setPeriod('day')">${t('dayTab')}</button>
        <button class="ptab${state.chartPeriod === 'month' ? ' active' : ''}" onclick="app.setPeriod('month')">${t('monthTab')}</button>
        <button class="ptab${state.chartPeriod === 'year'  ? ' active' : ''}" onclick="app.setPeriod('year')">${t('yearTab')}</button>
      </div>
      <div style="position:relative;height:240px">
        <canvas id="schart" role="img" aria-label="Sales bar chart"></canvas>
      </div>
    </div>

    <div class="stats-grid" style="margin-bottom:16px">
      <div class="stat-card"><div class="stat-num green">${formatMoney(allRevenue)}</div><div class="stat-lbl">${t('allTime')}</div></div>
      <div class="stat-card"><div class="stat-num">${allTxn}</div><div class="stat-lbl">${t('allTxn')}</div></div>
    </div>

    <div class="sec-hdr"><span class="sec-ttl">${t('dailyLog').toUpperCase()}</span></div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:16px">
      ${!dailyEntries.length
        ? `<div style="padding:22px;text-align:center;font-size:13px;color:var(--text3)">${t('noSales')}</div>`
        : dailyEntries.map(([date, data]) => `
          <div class="dl-row">
            <span style="font-weight:600;color:var(--text2)">${date}</span>
            <span style="color:var(--text3)">${data.count || 0} txn</span>
            <span style="font-weight:700;color:var(--greentext)">${formatMoney(data.total || 0)}</span>
          </div>`).join('')}
    </div>
    <div style="height:80px"></div>
  </div>`
}

export function renderChart() {
  const canvas = document.getElementById('schart')
  if (!canvas) return
  if (salesChart) { try { salesChart.destroy() } catch {} salesChart = null }

  const isDark = state.dark
  const tc = isDark ? '#c4a06a' : '#6b5b3e'
  const gc = isDark ? 'rgba(200,160,80,0.08)' : 'rgba(0,0,0,0.05)'

  let labels = [], data = []

  if (state.chartPeriod === 'day') {
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const k = d.toISOString().slice(0, 10)
      labels.push(k.slice(5))
      data.push(state.salesLog[k]?.total || 0)
    }
  } else if (state.chartPeriod === 'month') {
    const m = {}
    Object.entries(state.salesLog).forEach(([d, v]) => { const k = d.slice(0, 7); m[k] = (m[k] || 0) + (v.total || 0) })
    const s = Object.entries(m).sort((a, b) => a[0].localeCompare(b[0])).slice(-12)
    labels = s.map(x => x[0]); data = s.map(x => x[1])
    if (!labels.length) { labels = ['No data']; data = [0] }
  } else {
    const y = {}
    Object.entries(state.salesLog).forEach(([d, v]) => { const k = d.slice(0, 4); y[k] = (y[k] || 0) + (v.total || 0) })
    const s = Object.entries(y).sort((a, b) => a[0].localeCompare(b[0]))
    labels = s.map(x => x[0]); data = s.map(x => x[1])
    if (!labels.length) { labels = ['No data']; data = [0] }
  }

  salesChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Sales', data,
        backgroundColor: isDark ? 'rgba(224,151,60,0.75)' : 'rgba(184,115,42,0.72)',
        borderColor:     isDark ? '#e0973c' : '#b8732a',
        borderWidth: 1.5, borderRadius: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '₱' + Math.round(c.parsed.y).toLocaleString() } } },
      scales: {
        x: { ticks: { color: tc, font: { size: 11 }, maxRotation: 45, autoSkip: true }, grid: { color: gc } },
        y: { ticks: { color: tc, font: { size: 11 }, callback: v => '₱' + v.toLocaleString() }, grid: { color: gc }, beginAtZero: true },
      },
    },
  })
}
