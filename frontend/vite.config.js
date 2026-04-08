import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['kapi.tojest.dev'],
    proxy: {
      '/api': {
        target: 'http://fastapi:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co ws://localhost:*",
        "img-src 'self' data: blob:",
        "worker-src blob:",
      ].join('; '),
    },
  },
})
