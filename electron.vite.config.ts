import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { cssdts } from '@liuli-util/vite-plugin-css-dts'
import { i18nextDtsGen } from '@liuli-util/rollup-plugin-i18next-dts-gen'
import { plugin, Mode } from 'vite-plugin-markdown'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [
      react(),
      cssdts(),
      i18nextDtsGen({
        dirs: ['src/renderer/src/i18n'],
      }),
      plugin({ mode: [Mode.HTML, Mode.REACT] }),
    ],
  },
})
