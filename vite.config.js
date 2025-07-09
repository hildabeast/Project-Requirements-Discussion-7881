import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Base path for Netlify (use relative paths)
  base: './',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  
  build: {
    outDir: 'dist',
    // Generate sourcemaps for debugging (can be disabled in production)
    sourcemap: false,
    
    // Ensure CSS is properly extracted
    cssCodeSplit: true,
    
    // Use terser for better minification
    minify: 'terser',
    
    // Configure asset handling for Netlify
    assetsDir: 'assets',
    
    // Ensure proper asset inlining thresholds
    assetsInlineLimit: 4096,
    
    // Configure Rollup options for better asset handling
    rollupOptions: {
      output: {
        // Consistent naming pattern for Netlify
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        
        // Ensure proper code splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'react-icons'],
          supabase: ['@supabase/supabase-js'],
          utils: ['date-fns', 'dompurify', 'marked']
        }
      }
    },
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Environment variables for production
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.VITE_SUPABASE_URL': JSON.stringify('https://kdohilkyqmkigjvptqir.supabase.co'),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkb2hpbGt5cW1raWdqdnB0cWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzcyMzMsImV4cCI6MjA2NzQxMzIzM30._HboLAkpNFj4AZJmG1p3cje4Hdru2cr411-GAofT610')
  },
  
  // Server configuration for development
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  }
});