// ── MODAL: Add Product (with smart search) + Edit Product ──
import { state }             from '../utils/state.js'
import { t }                 from '../utils/i18n.js'
import { formatMoney, esc }  from '../utils/formatters.js'
import { CATEGORIES, getCatEmoji, getCatLabel } from '../data/categories.js'
import { KNOWN_PRODUCTS }    from '../data/knownProducts.js'

// ── MODAL SHELL ──
export function showModal(html) {
  const mo = document.getElementById('mover')
  const mb = document.getElementById('mbox')
  mb.innerHTML = html
  mo.classList.add('open')
}
export function closeModal() {
  document.getElementById('mover').classList.remove('open')
}
export function closeBgClick(e) {
  if (e.target === document.getElementById('mover')) closeModal()
}

// ── PRODUCT FORM FIELDS (shared by add + edit) ──
function categoryGrid(selectedCat, gridId = 'cg') {
  return `
  <div class="cat-grid" id="${gridId}">
    ${Object.keys(CATEGORIES).map(c => `
      <div class="cc${selectedCat === c ? ' sel' : ''}" data-cat="${c}"
        onclick="app.selectCat('${c}', '${gridId}')">
        ${getCatEmoji(c)} ${getCatLabel(c, state.lang)}
      </div>`).join('')}
  </div>`
}

function productFormFields(p = {}, gridId = 'cg') {
  return `
  <div class="fg"><label class="fl">${t('fieldName')}</label>
    <input class="fi" id="m-name" value="${p.name || ''}" placeholder="e.g. Lucky Me Pancit Canton">
  </div>
  <div class="frow2">
    <div class="fg"><label class="fl">${t('fieldSize')}</label>
      <input class="fi" id="m-size" value="${p.size || ''}" placeholder="e.g. 55g">
    </div>
    <div class="fg"><label class="fl">${t('fieldPrice')}</label>
      <input class="fi" id="m-price" type="number" min="0" value="${p.price || ''}" placeholder="0">
    </div>
  </div>
  <div class="frow2">
    <div class="fg"><label class="fl">${t('fieldStock')}</label>
      <input class="fi" id="m-stock" type="number" min="0" value="${p.stock !== undefined ? p.stock : 0}">
    </div>
    <div class="fg"><label class="fl">${t('fieldLow')}</label>
      <input class="fi" id="m-low" type="number" min="0" value="${p.lowAt || 5}">
    </div>
  </div>
  <div class="fg"><label class="fl">${t('fieldCat')}</label>
    ${categoryGrid(p.cat || 'Snacks', gridId)}
  </div>`
}

// ── ADD MODAL ──
export function openAddModal() {
  showModal(`
  <div class="modal-title">
    <span>${t('modalNew')}</span>
    <button class="pa" onclick="app.closeModal()"><i class="ti ti-x"></i></button>
  </div>
  <p style="font-size:13px;color:var(--text3);margin-bottom:12px">${t('searchOrAdd')}</p>

  <div id="ps-wrap">
    <div class="sbox" style="margin-bottom:6px">
      <i class="ti ti-search"></i>
      <input id="ps-input" placeholder="${t('searchPh2')}"
        oninput="app.onProductSearch(this.value)" autocomplete="off">
    </div>
    <div id="ps-results"></div>
  </div>

  <div id="add-form" style="display:none">
    ${productFormFields({}, 'add-cg')}
    <button class="pri-btn" onclick="app.saveNewProduct()">
      <i class="ti ti-check" style="vertical-align:-2px;margin-right:5px"></i>${t('saveBtn')}
    </button>
    <button class="sec-btn" onclick="app.resetProductSearch()">
      ${t('searchAgain')}
    </button>
  </div>`)

  setTimeout(() => {
    const i = document.getElementById('ps-input')
    if (i) { i.focus(); app.onProductSearch('') }
  }, 40)
}

export function renderProductSearchResults(query) {
  const el = document.getElementById('ps-results')
  if (!el) return

  const existing = new Set(state.products.map(p => p.name.toLowerCase()))
  const filtered = query.length < 1
    ? KNOWN_PRODUCTS.filter(p => !existing.has(p.name.toLowerCase())).slice(0, 14)
    : KNOWN_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) &&
        !existing.has(p.name.toLowerCase())
      ).slice(0, 10)

  const newRow = query.trim()
    ? `<div class="ps-new" onclick="app.fillProductForm({name:'${esc(query.trim())}',size:'',price:0,cat:'Others'}, true)">
        <i class="ti ti-plus" style="font-size:16px"></i>
        <span>${t('addAsNew')} <b>${query.trim()}</b></span>
       </div>`
    : ''

  el.innerHTML = `
  <div class="ps-results">
    ${filtered.map(p => `
      <div class="ps-item" onclick="app.fillProductForm({name:'${esc(p.name)}',size:'${p.size}',price:${p.price},cat:'${p.cat}'})">
        <span style="font-size:22px">${getCatEmoji(p.cat)}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</div>
          <div style="font-size:11px;color:var(--text3)">${p.size} · ${getCatLabel(p.cat, state.lang)} · suggested ${formatMoney(p.price)}</div>
        </div>
        <i class="ti ti-chevron-right" style="font-size:14px;color:var(--text3)"></i>
      </div>`).join('')}
    ${newRow}
  </div>`
}

export function fillProductForm(data, focusPrice = false) {
  document.getElementById('ps-results').innerHTML = ''
  document.getElementById('add-form').style.display = 'block'
  document.getElementById('ps-wrap').style.display = 'none'

  document.getElementById('m-name').value  = data.name  || ''
  document.getElementById('m-size').value  = data.size  || ''
  document.getElementById('m-price').value = data.price || ''
  document.getElementById('m-stock').value = 0
  document.getElementById('m-low').value   = 5

  document.querySelectorAll('#add-cg .cc').forEach(el =>
    el.classList.toggle('sel', el.dataset.cat === data.cat)
  )
  setTimeout(() => {
    const f = document.getElementById(focusPrice ? 'm-price' : 'm-stock')
    if (f) f.focus()
  }, 40)
}

export function resetProductSearch() {
  document.getElementById('add-form').style.display = 'none'
  document.getElementById('ps-wrap').style.display = 'block'
  const i = document.getElementById('ps-input')
  if (i) { i.value = ''; i.focus() }
  app.onProductSearch('')
}

// ── EDIT MODAL ──
export function openEditModal(id) {
  const p = state.products.find(x => x.id === id)
  if (!p) return
  state._editingId = id

  showModal(`
  <div class="modal-title">
    <span>${t('modalEdit')}</span>
    <button class="pa" onclick="app.closeModal()"><i class="ti ti-x"></i></button>
  </div>
  ${productFormFields(p, 'edit-cg')}
  <button class="pri-btn" onclick="app.saveEditProduct()">
    <i class="ti ti-check" style="vertical-align:-2px;margin-right:5px"></i>${t('saveBtn')}
  </button>
  <button class="del-btn" onclick="app.deleteProduct()">
    <i class="ti ti-trash" style="vertical-align:-2px;margin-right:5px"></i>${t('deleteBtn')}
  </button>`)
}

export function getSelectedCat(gridId = 'cg') {
  return document.querySelector(`#${gridId} .cc.sel`)?.dataset.cat || 'Others'
}

export function selectCat(key, gridId = 'cg') {
  document.querySelectorAll(`#${gridId} .cc`).forEach(el =>
    el.classList.toggle('sel', el.dataset.cat === key)
  )
}
