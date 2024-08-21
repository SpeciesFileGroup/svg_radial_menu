import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/radialMenu.ts'),
      name: 'svg-radial-menu',
      fileName: 'svg-radial-menu'
    }
  }
})
