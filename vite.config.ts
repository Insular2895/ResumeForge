import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    emptyOutDir: false,
    outDir: 'src/web/static',
    lib: {
      entry: 'src/web/frontend/main.tsx',
      formats: ['es'],
      fileName: () => 'document-editor.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'document-editor.[ext]',
      },
    },
  },
})
