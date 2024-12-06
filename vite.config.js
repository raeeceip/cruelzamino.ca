import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [/@rollup\/rollup-linux-*/],  // Exclude problematic rollup binaries
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three'],
          routing: ['react-router-dom'],
          three: ['@react-three/fiber', '@react-three/drei']
        }
      }
    },
    target: 'esnext',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu']
  }
});