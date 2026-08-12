/** La parité des clés FR/EN est garantie par le type de en.ts.
 *  Restent les erreurs qu'un type ne voit pas : un placeholder oublié dans
 *  une traduction, une forme plurielle manquante, une valeur vide. */

import { describe, expect, it } from 'vitest'
import { fr } from './fr.ts'
import { en } from './en.ts'
import { resolveLang } from './index.tsx'

type Key = keyof typeof fr

const keys = Object.keys(fr) as Key[]

const placeholders = (value: string): string[] =>
  [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort()

describe('dictionnaires', () => {
  it('ne laisse aucune traduction vide', () => {
    const empty = keys.filter((k) => !fr[k].trim() || !en[k].trim())
    expect(empty).toEqual([])
  })

  it('utilise les mêmes placeholders des deux côtés', () => {
    const mismatched = keys.filter(
      (k) => placeholders(fr[k]).join() !== placeholders(en[k]).join(),
    )
    expect(mismatched).toEqual([])
  })

  // Un pluriel est une paire `.one` / `.other` : « app.type.other » est un
  // type de course, pas une forme grammaticale.
  const pluralBases = keys
    .filter((k) => k.endsWith('.one'))
    .map((k) => k.replace(/\.one$/, ''))

  it('déclare les deux formes de chaque pluriel', () => {
    expect(pluralBases.length).toBeGreaterThan(0)
    const missing = pluralBases.filter(
      (base) => !keys.includes(`${base}.other` as Key),
    )
    expect(missing).toEqual([])
  })

  it('donne un compteur {n} à chaque forme plurielle', () => {
    const forms = pluralBases.flatMap((base) => [
      `${base}.one` as Key,
      `${base}.other` as Key,
    ])
    const withoutCount = forms.filter(
      (k) =>
        !fr[k].includes('{n}') &&
        // Une forme peut se passer du nombre quand la phrase le nomme
        // autrement — « Effacer la course de cet appareil ? ».
        !k.startsWith('app.settings.eraseAsk'),
    )
    expect(withoutCount).toEqual([])
  })
})

describe('resolveLang', () => {
  it('respecte un choix explicite', () => {
    expect(resolveLang('fr')).toBe('fr')
    expect(resolveLang('en')).toBe('en')
  })

  it('retombe sur le français quand le système n’est ni l’un ni l’autre', () => {
    const original = Object.getOwnPropertyDescriptor(
      window.navigator,
      'languages',
    )
    Object.defineProperty(window.navigator, 'languages', {
      value: ['de-DE'],
      configurable: true,
    })
    expect(resolveLang('system')).toBe('fr')

    Object.defineProperty(window.navigator, 'languages', {
      value: ['en-US', 'fr-FR'],
      configurable: true,
    })
    expect(resolveLang('system')).toBe('en')

    if (original) {
      Object.defineProperty(window.navigator, 'languages', original)
    }
  })
})
