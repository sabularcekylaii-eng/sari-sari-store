import { supabase } from '../supabaseClient.js'

// Settings still use localStorage (they're just preferences, not real data)
const KEYS = {
  STORE_NAME: 'sn_nm',
  LANG:       'sn_lg',
  DARK:       'sn_dk',
}

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export const storage = {
  // Settings stay in localStorage (just preferences)
  getStoreName: ()     => load(KEYS.STORE_NAME) || '',
  setStoreName: (name) => save(KEYS.STORE_NAME, name),
  getLang:      ()     => load(KEYS.LANG) || 'eng',
  setLang:      (lang) => save(KEYS.LANG, lang),
  getDark:      ()     => load(KEYS.DARK) || false,
  setDark:      (val)  => save(KEYS.DARK, val),

  // Products → Supabase
  async getProducts() {
    const { data, error } = await supabase.from('products').select('*')
    if (error) { console.error(error); return [] }
    return data
  },
  async setProducts(products) {
    // Delete all then re-insert (simple approach)
    await supabase.from('products').delete().neq('id', '')
    if (products.length > 0) {
      const { error } = await supabase.from('products').insert(products)
      if (error) console.error(error)
    }
  },
  async addProduct(product) {
    const { error } = await supabase.from('products').insert(product)
    if (error) console.error(error)
  },
  async updateProduct(id, updates) {
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    if (error) console.error(error)
  },
  async deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) console.error(error)
  },

  // Sales → Supabase
  async getSales() {
    const { data, error } = await supabase.from('sales').select('*')
    if (error) { console.error(error); return {} }
    // Convert back to { 'YYYY-MM-DD': { total, count, items[] } } format
    const salesLog = {}
    data.forEach(sale => {
      const date = sale.created_at.slice(0, 10)
      if (!salesLog[date]) salesLog[date] = { total: 0, count: 0, items: [] }
      salesLog[date].total += sale.total
      salesLog[date].count += 1
    })
    return salesLog
  },
  async addSale(sale) {
    const { error } = await supabase.from('sales').insert(sale)
    if (error) console.error(error)
  },
}