import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Quan trọng: base './' giúp Electron tìm thấy file asset khi chạy file://
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
        output: {
            manualChunks: {
                vendor: ['react', 'react-dom', 'recharts', 'lucide-react', 'xlsx', '@supabase/supabase-js'],
            },
        },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})