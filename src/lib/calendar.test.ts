import { describe, expect, it } from 'vitest'
import { buildMonth, countByMonth } from './calendar.ts'
import type { DayEntry } from './calendar.ts'
import type { Race } from './types.ts'

const race = (patch: Partial<Race> & { date: string }): Race => ({
  id: patch.date,
  type: '10k',
  name: 'course',
  distance: 10,
  duration: '45:00',
  elevationGain: null,
  location: '',
  notes: '',
  ...patch,
})

const days = (entries: ReturnType<typeof buildMonth>): DayEntry[] =>
  entries.filter((e): e is DayEntry => e.kind === 'day')

describe('buildMonth', () => {
  it('replie un creux de trois jours ou plus, pas en dessous', () => {
    // Août 2026 : courses le 1er, le 3 (creux de 1) et le 7 (creux de 3).
    const entries = buildMonth(
      [race({ date: '2026-08-01' }), race({ date: '2026-08-03' }), race({ date: '2026-08-07' })],
      2026,
      7,
    )
    const gaps = entries.filter((e) => e.kind === 'gap')
    // Le 2 reste visible ; le 4-6 et la fin du mois sont repliés.
    expect(days(entries).some((d) => d.iso === '2026-08-02')).toBe(true)
    expect(gaps).toHaveLength(2)
    expect(gaps[0]).toMatchObject({ days: 3 })
    expect(gaps[1]).toMatchObject({ days: 24 })
  })

  it('prolonge une course de deux jours par un trait', () => {
    const utmb = race({
      date: '2026-08-28',
      duration: '46:30:00',
      name: 'UTMB',
    })
    const entries = days(buildMonth([utmb], 2026, 7))

    const start = entries.find((d) => d.iso === '2026-08-28')
    expect(start).toMatchObject({ lineDown: true, lineUp: false })
    expect(start?.race?.name).toBe('UTMB')

    const next = entries.find((d) => d.iso === '2026-08-29')
    expect(next).toMatchObject({ lineUp: true, lineDown: false })
    expect(next?.race).toBeNull()
    expect(next?.continuation?.name).toBe('UTMB')
  })

  it('traverse une course de trois jours sans interruption', () => {
    const entries = days(
      buildMonth([race({ date: '2026-08-10', duration: '60:00:00' })], 2026, 7),
    )
    const middle = entries.find((d) => d.iso === '2026-08-11')
    expect(middle).toMatchObject({ lineUp: true, lineDown: true })
    const last = entries.find((d) => d.iso === '2026-08-12')
    expect(last).toMatchObject({ lineUp: true, lineDown: false })
  })

  it('poursuit une course par-dessus un changement de mois', () => {
    const entries = days(
      buildMonth([race({ date: '2026-08-31', duration: '30:00:00' })], 2026, 8),
    )
    const first = entries.find((d) => d.iso === '2026-09-01')
    expect(first?.continuation).not.toBeNull()
    expect(first?.lineUp).toBe(true)
  })

  it('produit une ligne par jour du mois quand tous sont occupés', () => {
    const février = Array.from({ length: 28 }, (_, i) =>
      race({ date: `2026-02-${String(i + 1).padStart(2, '0')}` }),
    )
    expect(days(buildMonth(février, 2026, 1))).toHaveLength(28)
  })
})

describe('countByMonth', () => {
  it('compte les départs, année par année', () => {
    const counts = countByMonth(
      [
        race({ date: '2026-08-02' }),
        race({ date: '2026-08-28' }),
        race({ date: '2026-02-15' }),
        race({ date: '2025-10-12' }),
      ],
      2026,
    )
    expect(counts[7]).toBe(2)
    expect(counts[1]).toBe(1)
    expect(counts[9]).toBe(0)
    expect(counts).toHaveLength(12)
  })
})
