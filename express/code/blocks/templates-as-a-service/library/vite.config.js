import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/main.jsx',
      fileName: (format) => `templates-as-a-service.min.${format}.js`,
      formats: ['es']
    },
    sourcemap: true
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.INCLUDE_EXTERNAL_STYLES': '"false"',
    global: 'globalThis'
  }
})
