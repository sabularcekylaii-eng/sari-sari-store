// All product categories with emoji and Tagalog translation
export const CATEGORIES = {
  'Canned Goods':   { fil: 'Delata',        emoji: '🥫' },
  'Snacks':         { fil: 'Meryenda',       emoji: '🍪' },
  'Drinks':         { fil: 'Inumin',         emoji: '🧃' },
  'Soap & Cleaning':{ fil: 'Sabon/Linis',    emoji: '🧼' },
  'Rice & Food':    { fil: 'Bigas/Pagkain',  emoji: '🍚' },
  'Medicine':       { fil: 'Gamot',          emoji: '💊' },
  'Condiments':     { fil: 'Condiments',     emoji: '🧴' },
  'Bakery':         { fil: 'Panaderya',      emoji: '🍞' },
  'Others':         { fil: 'Iba Pa',         emoji: '📦' },
}

export const getCatEmoji = (key) => CATEGORIES[key]?.emoji || '📦'
export const getCatLabel = (key, lang) =>
  lang === 'fil' ? (CATEGORIES[key]?.fil || key) : key
