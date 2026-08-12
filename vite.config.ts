import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Source unique de la version : package.json.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: '/app',
        name: 'race. — journal de courses',
        short_name: 'race.',
        description:
          'Toutes vos courses, une ligne chacune. Local, hors ligne, sans compte.',
        lang: 'fr',
        dir: 'ltr',
        start_url: '/app',
        scope: '/',
        display: 'standalone',
        // Pas de verrou d'orientation : la mise en page a trois paliers, et
        // c'est en paysage qu'une tablette atteint celui à deux colonnes.
        background_color: '#f2f3f2',
        theme_color: '#f2f3f2',
        categories: ['health', 'fitness', 'lifestyle'],
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // og.png n'est lu que par les robots d'aperçu de lien : la précacher
        // coûterait 15 ko hors ligne à chaque visiteur, pour rien.
        globIgnores: ['**/og.png'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        // Aucune requête réseau à l'usage : tout est précaché, rien n'est
        // récupéré à la volée. Pas de runtimeCaching par construction.
        runtimeCaching: [],
      },
      // Sans cela, /manifest.webmanifest n'existe pas en développement et
      // le navigateur reçoit la page de repli — une erreur de console à
      // chaque rechargement, pour un fichier pourtant correct en production.
      devOptions: { enabled: true, type: 'module', navigateFallback: 'index.html' },
    }),
  ],
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
  },
})
