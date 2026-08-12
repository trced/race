/** Ce que le déploiement doit garantir pour qu'une version publiée arrive
 *  jusqu'à une application déjà installée. Rien ici n'est vérifiable à
 *  l'exécution : ce sont des réglages qu'on casse d'un mot, et dont la panne
 *  ne se voit qu'une fois en production, chez quelqu'un d'autre. */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Les tests tournent en jsdom, où `import.meta.url` n'est pas une adresse de
// fichier : les chemins partent de la racine du projet, que Vitest prend pour
// répertoire de travail.
const read = (name: string) => readFileSync(join(process.cwd(), name), 'utf8')

const viteConfig = read('vite.config.ts')

interface VercelConfig {
  rewrites: { source: string; destination: string }[]
  headers: { source: string; headers: { key: string; value: string }[] }[]
}

const vercel = JSON.parse(read('vercel.json')) as VercelConfig

describe('vite.config.ts', () => {
  it('laisse le nouveau worker attendre au lieu de prendre la main', () => {
    /*
     * `autoUpdate` rechargerait la page dès qu'une version est prête, sans
     * prévenir. Le journal ne vit que dans le navigateur : une course en
     * cours de saisie partirait avec. La bascule est d'un mot, et rien
     * d'autre dans le projet ne la signalerait.
     */
    expect(viteConfig).toMatch(/registerType:\s*'prompt'/)
    // Le mot en prose est autorisé — l'option, non : elle annulerait l'attente.
    expect(viteConfig).not.toMatch(/skipWaiting\s*:/)
  })

  it('fait attraper la page dès la première visite', () => {
    expect(viteConfig).toMatch(/clientsClaim:\s*true/)
  })

  it('purge le précache de la version précédente', () => {
    expect(viteConfig).toMatch(/cleanupOutdatedCaches:\s*true/)
  })
})

describe('vercel.json', () => {
  const cacheControl = (source: string) =>
    vercel.headers
      .find((entry) => entry.source === source)
      ?.headers.find((header) => header.key === 'Cache-Control')?.value

  it('fait revalider les trois fichiers qui portent la version', () => {
    /*
     * Le cœur du problème. Servis depuis le cache de l'hébergeur, `sw.js` et
     * `index.html` restent ceux de la version précédente : le navigateur ne
     * découvre jamais qu'il existe autre chose, et l'application installée
     * tourne indéfiniment sur l'ancienne. Le bandeau ne peut rien proposer
     * qu'on ne lui a pas laissé voir.
     */
    for (const source of ['/sw.js', '/index.html', '/manifest.webmanifest']) {
      expect(cacheControl(source), source).toMatch(/max-age=0/)
      expect(cacheControl(source), source).toMatch(/must-revalidate/)
    }
  })

  it('garde les fichiers versionnés immuables', () => {
    // Leur nom contient déjà leur empreinte : les revalider ne trouverait
    // jamais rien de neuf.
    expect(cacheControl('/assets/(.*)')).toMatch(/immutable/)
  })

  it('sert la coquille aux routes, et les fichiers tels quels', () => {
    const rewrite = vercel.rewrites[0]
    expect(rewrite).toBeDefined()
    const pattern = new RegExp(`^${rewrite?.source ?? ''}$`)

    // Les routes du site et de l'application retombent sur index.html : sans
    // cela, recharger ailleurs qu'à la racine donne un 404.
    for (const route of ['/app', '/about', '/legal/privacy']) {
      expect(pattern.test(route), `${route} devrait être réécrit`).toBe(true)
    }

    // Les fichiers, eux, doivent sortir intacts — à commencer par le worker,
    // que la coquille remplacerait sans rien dire.
    for (const file of [
      '/sw.js',
      '/manifest.webmanifest',
      '/favicon.svg',
      '/icon-192.png',
      '/assets/index-abc123.js',
    ]) {
      expect(pattern.test(file), `${file} serait réécrit`).toBe(false)
    }
  })
})
