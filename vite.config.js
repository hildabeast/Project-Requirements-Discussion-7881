import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Set base to './' to ensure all assets use relative paths
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Ensure CSS is properly extracted
    cssCodeSplit: true,
    // Configure asset handling
    assetsDir: 'assets',
    // Ensure assets are copied with correct paths
    assetsInlineLimit: 4096, // 4kb
    // Configure Rollup options for better asset handling
    rollupOptions: {
      output: {
        // Preserve directory structure for assets
        assetFileNames: 'assets/[name].[hash][extname]',
        // Chunk vendor code
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'react-icons'],
          supabase: ['@supabase/supabase-js']
        },
        // Ensure entry points are properly named
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js'
      }
    }
  },
  // Environment variables for the application
  define: {
    'process.env.VITE_APP_NAME': JSON.stringify('readysetgoteach-frontend-7881'),
  }
});