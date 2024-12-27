import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    watch: {
      usePolling: true, // Active le polling pour Docker
      interval: 100 // Réduit l'intervalle de polling pour une meilleure réactivité
    },
    host: true, // Nécessaire pour Docker
    strictPort: true,
    port: 5173
  }
})