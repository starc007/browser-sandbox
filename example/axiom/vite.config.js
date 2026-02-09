import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: false,
      allowedHosts: ['.nodeops.app'],
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: false,
      allowedHosts: ['.nodeops.app'],
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    }
  }
})