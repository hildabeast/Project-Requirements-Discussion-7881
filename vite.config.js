import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: Set base to './' for relative asset paths
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    // Generate sourcemaps for easier debugging
    sourcemap: true,
    // Ensure CSS is properly extracted
    cssCodeSplit: true,
    minify: 'terser',
    // Configure asset handling for production
    assetsDir: 'assets',
    // Configure Rollup options for better asset handling
    rollupOptions: {
      output: {
        // FIXED: Use simpler asset naming pattern with hyphens
        assetFileNames: 'assets/[name]-[hash][extname]',
        // FIXED: Use simpler chunk naming with hyphens
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Ensure proper code splitting
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('supabase')) return 'vendor-supabase';
            if (id.includes('framer-motion') || id.includes('react-icons')) return 'vendor-ui';
            return 'vendor'; // all other node_modules
          }
        }
      }
    }
  },
  // Ensure proper environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VITE_SUPABASE_URL': JSON.stringify('https://kdohilkyqmkigjvptqir.supabase.co'),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkb2hpbGt5cW1raWdqdnB0cWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzcyMzMsImV4cCI6MjA2NzQxMzIzM30._HboLAkpNFj4AZJmG1p3cje4Hdru2cr411-GAofT610'),
  }
});