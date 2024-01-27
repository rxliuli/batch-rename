import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { plugin, Mode } from 'vite-plugin-markdown'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: '#app',
        additionalPrerenderRoutes: ['/404'],
      },
    }),
    plugin({ mode: [Mode.HTML, Mode.REACT] }),
    svgr(),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
}))
