import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Question data chunks are automatically handled by dynamic imports
        }
      }
    },
    // Enable compression and optimizations
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  // Enable prefetching for better performance
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
