import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
  }
})
