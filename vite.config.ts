import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],
  base: "/Unlucky/",
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1000,

    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("socket.io") || id.includes("axios")) {
              return "network-vendor"
            }
          }
          return "vendor"
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})
