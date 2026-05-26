import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/patients': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/doctors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/rooms': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/admissions': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/treatments': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/bill': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
