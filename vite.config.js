import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'three',
            '@react-three/fiber',
            '@react-three/drei'
          ]
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  server: {
    port: 3000
  }
});