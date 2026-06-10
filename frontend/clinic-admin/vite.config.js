import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Latest Vite + React plugin. Dev server on http://localhost:3000
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true, host: 'localhost' },
});
