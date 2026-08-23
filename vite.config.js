import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        navigateFallbackDenylist: [/\.pdf$/]
      },
      manifest: {
        name: '코타키나발루 가족 여행 가이드',
        short_name: '코타 가이드',
        description: '우리 가족의 완벽한 코타키나발루 3박 5일 여행 가이드',
        theme_color: '#0077b6',
        background_color: '#caf0f8',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
