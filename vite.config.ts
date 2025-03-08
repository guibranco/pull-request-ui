import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pull-request-ui/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});