import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Use relative paths for Netlify
  base: './',
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  preview: {
    port: 4173,
    host: true
  }
});