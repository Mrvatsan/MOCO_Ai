// Vite Configuration for MOCO_AI Frontend
// Includes React and Tailwind CSS v4 plugins
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})

// End of Vite Configuration
