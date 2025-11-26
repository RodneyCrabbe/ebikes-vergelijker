import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp', '**/*.avif'],
  server: {
    host: '127.0.0.1',
    port: 5195,
    strictPort: true, // Force port 5195
    open: false,
    cors: true,
    hmr: {
      overlay: true
    },
    // Remove incorrect Content-Type header - Vite handles this automatically
    middlewareMode: false,
    fs: {
      strict: false,
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for better performance
    minify: 'terser', // Use terser for better minification
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['vue', 'vue-router', 'pinia'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@headlessui/vue', '@heroicons/vue'],
          // Split large components
          components: [
            'src/components/EnhancedAIChatbot.vue',
            'src/views/EBikeListPage.vue',
            'src/views/EBikeDetailPage.vue'
          ]
        }
      },
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        warn(warning)
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'] // Remove specific console functions
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@supabase/supabase-js']
  },
  define: {
    global: 'globalThis',
  },
  esbuild: {
    target: 'esnext',
    // Only drop console/debugger in production build, not in dev
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  ssr: {
    noExternal: ['@supabase/supabase-js']
  },
  // Performance optimizations
  css: {
    devSourcemap: false // Disable CSS sourcemaps for better performance
  }
})
