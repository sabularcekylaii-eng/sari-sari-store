import { defineConfig } from 'vite'

export default defineConfig({
  // Change this to your GitHub repo name if deploying to GitHub Pages
  // e.g. if your repo is github.com/yourname/sari-sari-store → base: '/sari-sari-store/'
  // For Netlify / Vercel → keep base: '/'
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})
