import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, 'src'),
    }
  },
  // Removed API proxy since we're using direct MangaDex API calls
})
