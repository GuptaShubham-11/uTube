import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://localhost:8000', //use when you are in development mode
    },
  },
  plugins: [tailwindcss(), react()],
});
