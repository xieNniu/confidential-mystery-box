import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'rollup-plugin-polyfill-node'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      events: 'events',
      util: 'util',
      stream: 'stream-browserify',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    include: [
      '@zama-fhe/relayer-sdk/web',
      'ethers',
      'buffer',
      'process',
      'util',
      'events',
      'stream-browserify',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    target: 'es2020',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})

