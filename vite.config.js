import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: "https://we-server-0tom.onrender.com/",
        changeOrigin: true,
        secure: false,
      }
    },
  },
})

// target: "https://we-server-0tom.onrender.com/",