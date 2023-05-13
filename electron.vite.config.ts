import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { cssdts } from '@liuli-util/vite-plugin-css-dts'
import { i18nextDtsGen } from '@liuli-util/rollup-plugin-i18next-dts-gen'
import { plugin, Mode } from 'vite-plugin-markdown'
import { VitePWA } from 'vite-plugin-pwa'

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
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          id: 'rxliuli.batch-rename',
          short_name: ' batch-rename',
          name: 'Batch File Renaming',
          icons: [
            {
              src: '/icon.png',
              sizes: '256x256',
              type: 'image/png',
            },
          ],
          file_handlers: [
            {
              action: './',
              accept: {
                // ref: https://developer.mozilla.org/zh-CN/docs/Web/Media/Formats/Image_types
                'image/*': [
                  '.apng',
                  '.avif',
                  '.bmp',
                  '.gif',
                  '.ico',
                  '.cur',
                  '.jpg',
                  '.jpeg',
                  '.jfif',
                  '.pjpeg',
                  '.pjp',
                  '.png',
                  '.svg',
                  '.tif',
                  '.tiff',
                  '.webp',
                ],
              },
            },
          ],
        },
      }),
      plugin({ mode: [Mode.HTML] }),
    ],
  },
})
