import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy local path to the external n8n webhook to avoid CORS
      '/n8n-webhook': {
        target: 'https://ritik-n8n-e9673da43cf4.herokuapp.com',
        changeOrigin: true,
        secure: true,
        // Rewrite to the actual webhook path
        rewrite: (path) => path.replace('/n8n-webhook', '/webhook/a38ed656-03ad-43a5-ad5a-a9a4b6e9b7d9'),
      },
      // Use n8n's test URL (works when workflow is not activated)
      '/n8n-webhook-test': {
        target: 'https://ritik-n8n-e9673da43cf4.herokuapp.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace('/n8n-webhook-test', '/webhook-test/a38ed656-03ad-43a5-ad5a-a9a4b6e9b7d9'),
      },
    },
  },
})
