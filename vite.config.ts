import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor';
            }
            // Form handling
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('hookform')) {
              return 'form';
            }
            // i18n
            if (id.includes('i18next')) {
              return 'i18n';
            }
            // Supabase - separate chunk
            if (id.includes('supabase')) {
              return 'supabase';
            }
            // Lucide icons
            if (id.includes('lucide')) {
              return 'icons';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-i18next', 'i18next'],
  },
})
