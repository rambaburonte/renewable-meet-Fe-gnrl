import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Maps '@' to the 'src' directory
    },
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
      clientPort: 3000
    },
    proxy: {
      '/api': {
        target: 'http://147.93.102.131:8901',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,         // Disabled sourcemaps for production for faster builds
    minify: 'esbuild',        // Explicit minification
    chunkSizeWarningLimit: 600,
    target: 'es2015',         // Target modern browsers efficiently
    cssCodeSplit: true,       // Enable CSS code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['animejs', 'framer-motion'],
          visualizations: ['cobe', 'dotted-map']
        }
      }
    },
    reportCompressedSize: false,  // Disable compressed size reporting for faster builds
    emptyOutDir: true,           // Clean the output directory before build
  },
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase'
    },
    devSourcemap: false      // Disable CSS sourcemaps in development
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],  // Pre-bundle common dependencies
    esbuildOptions: {
      target: 'es2015'
    }
  }
});