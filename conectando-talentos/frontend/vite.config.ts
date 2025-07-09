import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    host: 'integrador',          // <- responde nesse host
    port: 5173,
    allowedHosts: ['integrador'] // <- evita “host not allowed”
  }
})
