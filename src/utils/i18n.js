// ── TRANSLATIONS (i18n) ──
// Two languages: English (eng) and Filipino (fil)
// Usage: t('addProd') — returns the string for the current lang

const TRANSLATIONS = {
  eng: {
    // Nav
    prods: 'Products', cust: 'Customer', sales: 'Sales', rpts: 'Reports',
    // Products view
    srchPh: 'Search products...', addProd: 'Add Product',
    stockOk: 'OK', stockLow: 'Low', stockOut: 'Out',
    editBtn: 'Edit', sellBtn: '-1 Sold', addCart: '+ Cart', inCart: '✓ In Cart',
    statTotal: 'Products', statLow: 'Low', statOut: 'Out', statToday: 'Today',
    // Suggestions
    suggestTitle: 'Suggested to Buy', lowWarn: 'Low stock', outWarn: 'Out of stock',
    // Cart / Checkout
    cartTitle: 'Customer Cart', cartEmpty: 'Cart is empty. Add items below.',
    checkout: 'Checkout', clearCart: 'Clear', cartTotal: 'TOTAL',
    availProds: 'Available Products',
    // Receipt
    receiptPrev: 'Receipt Preview', receiptThank: 'Thank you! Come again!',
    printBtn: 'Print Receipt', newTxn: 'New Transaction',
    // Sales / Reports
    salesLog: 'Sales Log', noSales: 'No sales yet.',
    allTime: 'All-Time Revenue', allTxn: 'Total Transactions',
    dailyLog: 'Daily Log', txn: 'transaction',
    dayTab: 'Day', monthTab: 'Month', yearTab: 'Year',
    // Product modal
    modalNew: 'Add Product', modalEdit: 'Edit Product',
    fieldName: 'Product Name', fieldSize: 'Size / Weight',
    fieldPrice: 'Price (₱)', fieldStock: 'Qty in Stock',
    fieldLow: 'Low Alert At', fieldCat: 'Category',
    saveBtn: 'Save', deleteBtn: 'Delete Product',
    searchAgain: '← Search again',
    // Add search
    searchOrAdd: 'Search from list or type a new product name',
    searchPh2: 'Search or type a product name...',
    addAsNew: 'Add as new product:',
    // Setup
    setupTitle: 'What is your store name?',
    setupSub: 'You can change this anytime.',
    setupPh: "e.g. Aling Maria's Store",
    setupBtn: 'Open My Store',
    editName: 'tap to rename',
    qty: 'pcs', all: 'All',
  },
  fil: {
    prods: 'Produkto', cust: 'Customer', sales: 'Benta', rpts: 'Ulat',
    srchPh: 'Hanapin ang produkto...', addProd: 'Magdagdag',
    stockOk: 'OK', stockLow: 'Mababa', stockOut: 'Ubos',
    editBtn: 'I-edit', sellBtn: '-1 Nabenta', addCart: '+ Cart', inCart: '✓ Sa Cart',
    statTotal: 'Produkto', statLow: 'Mababa', statOut: 'Ubos', statToday: 'Ngayon',
    suggestTitle: 'Dapat Bilhin', lowWarn: 'Mababang stock', outWarn: 'Ubos na',
    cartTitle: 'Cart ng Customer', cartEmpty: 'Walang laman. Mag-add ng item sa baba.',
    checkout: 'Bayad', clearCart: 'Alisin', cartTotal: 'KABUUAN',
    availProds: 'Mga Produkto',
    receiptPrev: 'Preview ng Resibo', receiptThank: 'Salamat! Bumalik kayo!',
    printBtn: 'I-print ang Resibo', newTxn: 'Bagong Transaksyon',
    salesLog: 'Talaan ng Benta', noSales: 'Wala pang benta.',
    allTime: 'Kabuuang Kita', allTxn: 'Lahat ng Transaksyon',
    dailyLog: 'Talaan', txn: 'transaksyon',
    dayTab: 'Araw', monthTab: 'Buwan', yearTab: 'Taon',
    modalNew: 'Bagong Produkto', modalEdit: 'I-edit ang Produkto',
    fieldName: 'Pangalan ng Produkto', fieldSize: 'Sukat / Gramo',
    fieldPrice: 'Presyo (₱)', fieldStock: 'Bilang sa Stock',
    fieldLow: 'Mababa sa', fieldCat: 'Kategorya',
    saveBtn: 'I-save', deleteBtn: 'Burahin ang Produkto',
    searchAgain: '← Maghanap muli',
    searchOrAdd: 'Maghanap mula sa listahan o mag-type ng bagong pangalan',
    searchPh2: 'Hanapin o mag-type ng pangalan...',
    addAsNew: 'Idagdag bilang bago:',
    setupTitle: 'Ano ang pangalan ng iyong tindahan?',
    setupSub: 'Pwede mong palitan ito anumang oras.',
    setupPh: 'hal. Tindahan ni Aling Maria',
    setupBtn: 'Buksan ang Tindahan',
    editName: 'pindutin para palitan',
    qty: 'piraso', all: 'Lahat',
  },
}

let currentLang = 'eng'

export const setLang = (lang) => { currentLang = lang }
export const getLang = ()      => currentLang
export const t = (key)         => TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.eng[key] || key
