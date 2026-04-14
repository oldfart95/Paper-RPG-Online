import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'Paper-RPG-Online';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${repoName}/` : '/',
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'motion', 'zustand'],
          pixi: ['pixi.js'],
        },
      },
    },
  },
}));
