// ── FORMATTERS ──
// Small pure functions — easy to unit test in Phase 5

/** Format a number as Philippine Peso  e.g. 1250 → "₱1,250" */
export const formatMoney = (n) => '₱' + Math.round(n).toLocaleString()

/** Get today's date as YYYY-MM-DD string in local time */
export const todayKey = () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Generate a new unique id — max existing id + 1 */
export const nextId = (items) => Math.max(0, ...items.map(i => i.id), 0) + 1

/** Escape single quotes for safe inline onclick strings */
export const esc = (s) => String(s).replace(/'/g, "\\'").replace(/"/g, '&quot;')
