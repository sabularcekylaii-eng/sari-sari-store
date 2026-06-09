import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sari-sari-store/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})
