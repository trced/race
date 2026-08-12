import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, hasRaces, loadState, saveState } from './storage.ts'
import { DEFAULT_SETTINGS, SCHEMA_VERSION } from './types.ts'
import type { Race } from './types.ts'

const utmb: Race = {
  id: 'r1',
  type: 'ultra',
  name: 'UTMB',
  date: '2026-08-28',
  distance: 170,
  duration: '46:30:00',
  elevationGain: 10000,
  location: 'Chamonix',
  notes: '',
}

describe('hasRaces', () => {
  // C'est cette fonction qui décide si « / » ouvre la présentation ou
  // l'application : chaque cas ci-dessous est une première impression.

  it('est faux sur un appareil qui n’a jamais rien écrit', () => {
    expect(hasRaces()).toBe(false)
  })

  it('est vrai dès qu’une course est enregistrée', () => {
    saveState({ races: [utmb], settings: DEFAULT_SETTINGS })
    expect(hasRaces()).toBe(true)
  })

  // Régler le thème sans noter de course ne fait pas de vous un habitué :
  // la présentation reste ce qu'il y a de plus utile à montrer.
  it('reste faux quand seuls les réglages ont été touchés', () => {
    saveState({ races: [], settings: { ...DEFAULT_SETTINGS, theme: 'dark' } })
    expect(hasRaces()).toBe(false)
  })

  it('redevient faux après un effacement complet', () => {
    saveState({ races: [utmb], settings: DEFAULT_SETTINGS })
    saveState({ races: [], settings: DEFAULT_SETTINGS })
    expect(hasRaces()).toBe(false)
  })

  // Un fichier corrompu ne doit pas envoyer sur une application qu'on n'a
  // pas su relire : on retombe sur la présentation.
  it('est faux quand le stockage est illisible', () => {
    window.localStorage.setItem(STORAGE_KEY, '{')
    expect(hasRaces()).toBe(false)
    expect(loadState().races).toEqual([])
  })

  it('est faux quand le schéma est d’une autre version', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: SCHEMA_VERSION + 1,
        data: { races: [utmb] },
        settings: {},
      }),
    )
    expect(hasRaces()).toBe(false)
  })
})
