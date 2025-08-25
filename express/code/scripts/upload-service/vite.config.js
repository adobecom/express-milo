import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: (format) => `acp-upload.min.${format}.js`,
      formats: ['es']
    },
    sourcemap: true
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.INCLUDE_EXTERNAL_STYLES': '"false"',
    global: 'globalThis'
  },
  esbuild: {
    target: 'es2020'
  }
})
