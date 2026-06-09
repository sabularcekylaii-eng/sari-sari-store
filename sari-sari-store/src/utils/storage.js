// ── LOCAL STORAGE HELPERS ──
// All data currently lives in localStorage.
// In Phase 3 (Supabase), these will be replaced by API calls —
// but the function names stay the same so the rest of the app doesn't change.

const KEYS = {
  STORE_NAME: 'sn_nm',
  LANG:       'sn_lg',
  DARK:       'sn_dk',
  PRODUCTS:   'sn_pr',
  SALES:      'sn_sl',
}

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full */ }
}

export const storage = {
  // Store settings
  getStoreName: ()         => load(KEYS.STORE_NAME) || '',
  setStoreName: (name)     => save(KEYS.STORE_NAME, name),
  getLang:      ()         => load(KEYS.LANG) || 'eng',
  setLang:      (lang)     => save(KEYS.LANG, lang),
  getDark:      ()         => load(KEYS.DARK) || false,
  setDark:      (val)      => save(KEYS.DARK, val),

  // Products
  getProducts:  ()         => load(KEYS.PRODUCTS),
  setProducts:  (products) => save(KEYS.PRODUCTS, products),

  // Sales log  { 'YYYY-MM-DD': { total, count, items[] } }
  getSales:     ()         => load(KEYS.SALES) || {},
  setSales:     (sales)    => save(KEYS.SALES, sales),

  // Save everything at once
  saveAll({ storeName, lang, dark, products, sales }) {
    if (storeName !== undefined) save(KEYS.STORE_NAME, storeName)
    if (lang      !== undefined) save(KEYS.LANG,       lang)
    if (dark      !== undefined) save(KEYS.DARK,       dark)
    if (products  !== undefined) save(KEYS.PRODUCTS,   products)
    if (sales     !== undefined) save(KEYS.SALES,      sales)
  },
}
