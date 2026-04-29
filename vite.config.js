import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { allowedHosts: ["devserver-main--luxury-creponne-2d6691.netlify.app", "devserver-construction--luxury-creponne-2d6691.netlify.app"] }

})
