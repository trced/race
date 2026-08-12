import { describe, expect, it } from 'vitest'
import {
  dayKey,
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
  formatPace,
  parseISODate,
  secondsToDuration,
  spanDays,
  toISODate,
  toSeconds,
} from './format.ts'
import type { Race } from './types.ts'

const race = (patch: Partial<Race> = {}): Race => ({
  id: 'x',
  type: '10k',
  name: 'test',
  date: '2026-08-02',
  distance: 10,
  duration: '45:00',
  elevationGain: null,
  location: '',
  notes: '',
  ...patch,
})

describe('toSeconds', () => {
  it('lit mm:ss et h:mm:ss', () => {
    expect(toSeconds('45:00')).toBe(2700)
    expect(toSeconds('1:38:20')).toBe(5900)
    expect(toSeconds('46:30:00')).toBe(167400)
  })

  it('renvoie 0 sur une entrée illisible', () => {
    expect(toSeconds('')).toBe(0)
    expect(toSeconds('abc')).toBe(0)
    expect(toSeconds('-1:00')).toBe(0)
  })
})

describe('formatDuration', () => {
  it('omet les heures en dessous d’une heure', () => {
    expect(formatDuration('45:00')).toBe('45:00')
    expect(formatDuration('21:40')).toBe('21:40')
  })

  it('écrit les heures avec des minutes sur deux chiffres', () => {
    expect(formatDuration('1:38:20')).toBe('1h38:20')
    expect(formatDuration('46:30:00')).toBe('46h30:00')
    expect(formatDuration('3:05:07')).toBe('3h05:07')
  })
})

describe('secondsToDuration', () => {
  it('fait l’aller-retour avec toSeconds', () => {
    expect(secondsToDuration(2700)).toBe('45:00')
    expect(toSeconds(secondsToDuration(5900))).toBe(5900)
  })
})

describe('formatDistance', () => {
  it('affiche les kilomètres avec la virgule française', () => {
    expect(formatDistance(21.1, 'km', 'fr-FR')).toBe('21,1 km')
    expect(formatDistance(10, 'km', 'fr-FR')).toBe('10 km')
  })

  it('convertit en miles', () => {
    expect(formatDistance(10, 'mi', 'en-GB')).toBe('6.2 mi')
    expect(formatDistance(42.2, 'mi', 'en-GB')).toBe('26.2 mi')
  })
})

describe('formatElevation', () => {
  it('groupe les milliers selon la locale', () => {
    expect(formatElevation(10000, 'km', 'fr-FR')).toMatch(/^10\s?000 m$/)
  })

  it('convertit en pieds', () => {
    expect(formatElevation(1000, 'mi', 'en-GB')).toBe('3,281 ft')
  })
})

describe('formatPace', () => {
  it('donne l’allure par kilomètre', () => {
    expect(formatPace(race(), 'km')).toBe('4:30/km')
  })

  it('donne l’allure par mile', () => {
    expect(formatPace(race(), 'mi')).toBe('7:15/mi')
  })

  it('ne divise pas par zéro', () => {
    expect(formatPace(race({ distance: 0 }), 'km')).toBe('')
  })
})

describe('parseISODate', () => {
  it('accepte une date réelle', () => {
    const date = parseISODate('2026-08-28')
    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(7)
    expect(date?.getDate()).toBe(28)
  })

  it('refuse une date qui n’existe pas plutôt que de la corriger', () => {
    expect(parseISODate('2026-02-31')).toBeNull()
    expect(parseISODate('2026-13-01')).toBeNull()
    expect(parseISODate('28/08/2026')).toBeNull()
  })

  it('fait l’aller-retour avec toISODate sans décalage de fuseau', () => {
    const iso = '2026-01-01'
    expect(toISODate(parseISODate(iso)!)).toBe(iso)
  })
})

describe('formatDate', () => {
  it('suit la locale', () => {
    expect(formatDate('2026-08-28', 'fr-FR')).toBe('28 août 2026')
    expect(formatDate('2026-08-28', 'en-GB')).toBe('28 August 2026')
  })
})

describe('dayKey', () => {
  it('abrège le jour et complète le quantième', () => {
    expect(dayKey(new Date(2026, 7, 2), 'fr-FR')).toBe('dim 02')
    expect(dayKey(new Date(2026, 7, 28), 'en-GB')).toBe('Fri 28')
  })
})

describe('spanDays', () => {
  it('compte un jour pour une course courte', () => {
    expect(spanDays(race())).toBe(1)
  })

  it('compte les jours entamés d’un ultra', () => {
    expect(spanDays(race({ duration: '46:30:00' }))).toBe(2)
    expect(spanDays(race({ duration: '50:00:00' }))).toBe(3)
  })
})
