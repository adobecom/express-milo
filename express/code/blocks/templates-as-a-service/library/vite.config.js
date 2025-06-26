import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      fileName: 'templates-as-a-service',
      formats: ['es']
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    global: 'globalThis'
  }
})
