import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import compression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '*.ngrok-free.dev', '*.ngrok.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },
      '/view-pdf': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      },
      '/view-image': {
        target: 'http://localhost:3004',
        changeOrigin: true,
      }
    },
  },
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'indo-logo.png'],
      manifest: {
        name: 'Indo American School',
        short_name: 'IAS Jhajjar',
        description: 'Indo American School - Premier CBSE School in Jhajjar',
        theme_color: '#1a365d',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/indo-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/indo-logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/indo-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/indo-logo.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        // only enable service worker during production builds; dev server caches
        // can interfere with HMR and cause 500s when tsx files are imported.
        enabled: false,
        type: 'module'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg}'],
        globIgnores: ['uploads/**'],
        // avoid precaching very large user-uploaded files in /uploads
        // increase cache limit to allow larger static images to be precached
        maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
}));