import { describe, expect, it } from 'vitest'
import { computeRecords, computeTotals } from './records.ts'
import type { Race } from './types.ts'

const race = (
  patch: Partial<Race> & { name: string; distance: number; duration: string },
): Race => ({
  id: patch.name,
  type: '10k',
  date: '2026-01-01',
  elevationGain: null,
  location: '',
  notes: '',
  ...patch,
})

describe('computeRecords', () => {
  it('classe le meilleur temps et l’écart avec la deuxième', () => {
    const [cinq, dix] = computeRecords([
      race({ name: 'rapide', distance: 10, duration: '43:12' }),
      race({ name: 'lente', distance: 10, duration: '45:00' }),
    ])
    expect(cinq?.best).toBeNull()
    expect(cinq?.count).toBe(0)
    expect(dix?.best?.name).toBe('rapide')
    expect(dix?.count).toBe(2)
    expect(dix?.gapSeconds).toBe(108)
  })

  it('tolère 2 % d’écart sur la distance mesurée', () => {
    const records = computeRecords([
      race({ name: 'presque 10', distance: 10.2, duration: '44:00' }),
      race({ name: 'trop long', distance: 10.5, duration: '40:00' }),
    ])
    const dix = records.find((r) => r.category.km === 10)
    expect(dix?.count).toBe(1)
    expect(dix?.best?.name).toBe('presque 10')
  })

  it('n’a pas d’écart quand il n’y a qu’une course', () => {
    const records = computeRecords([
      race({ name: 'seule', distance: 42.2, duration: '3:32:10' }),
    ])
    const marathon = records.find((r) => r.category.km === 42.2)
    expect(marathon?.gapSeconds).toBeNull()
  })

  it('garde les quatre catégories, même vides', () => {
    expect(computeRecords([])).toHaveLength(4)
  })
})

describe('computeTotals', () => {
  it('additionne et retient les extrêmes', () => {
    const totals = computeTotals([
      race({ name: 'UTMB', distance: 170, duration: '46:30:00', elevationGain: 10000 }),
      race({ name: '10k', distance: 10, duration: '45:00' }),
      race({ name: 'Trail', distance: 32, duration: '4:12:00', elevationGain: 1450 }),
    ])
    expect(totals.races).toBe(3)
    expect(totals.km).toBe(212)
    expect(totals.elevation).toBe(11450)
    expect(totals.longest?.name).toBe('UTMB')
    expect(totals.steepest?.name).toBe('UTMB')
  })

  it('n’invente rien sur un journal vide', () => {
    expect(computeTotals([])).toEqual({
      races: 0,
      km: 0,
      elevation: 0,
      longest: null,
      steepest: null,
    })
  })
})
