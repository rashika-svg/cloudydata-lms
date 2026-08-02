import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static SPA — no backend, no env, nothing to proxy.
// `base: './'` keeps the build portable so `dist/` can be dropped on
// GitHub Pages, Netlify, or opened from a sub-path without rewriting asset URLs.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Keep the vendor chunk separate so the app code can be re-cached
        // independently of React/router on redeploys.
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
