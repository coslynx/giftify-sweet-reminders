import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite automatically loads environment variables prefixed with VITE_
  // from .env files. No specific configuration is needed here for that.
});