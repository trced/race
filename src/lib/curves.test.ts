import { describe, expect, it } from 'vitest'
import {
  buildCurve,
  curveScale,
  curveTypes,
  metricFor,
  paceSecondsOf,
  timeBounds,
  yearTicks,
} from './curves.ts'
import type { Race } from './types.ts'

const race = (
  patch: Partial<Race> & { name: string; date: string; duration: string },
): Race => ({
  id: patch.name,
  type: '10k',
  distance: 10,
  elevationGain: null,
  location: '',
  notes: '',
  ...patch,
})

describe('curveTypes', () => {
  it('ne garde que les types présents, dans l’ordre déclaré', () => {
    expect(
      curveTypes([
        race({ name: 'marathon', date: '2026-01-01', duration: '3:32:10', type: 'marathon' }),
        race({ name: 'dix', date: '2026-02-01', duration: '45:00' }),
        race({ name: 'encore dix', date: '2026-03-01', duration: '44:00' }),
      ]),
    ).toEqual(['10k', 'marathon'])
  })

  it('ne propose rien sur un journal vide', () => {
    expect(curveTypes([])).toEqual([])
  })
})

describe('metricFor', () => {
  it('trace le temps là où la distance est officielle', () => {
    expect(metricFor('5k')).toBe('time')
    expect(metricFor('10k')).toBe('time')
    expect(metricFor('semi')).toBe('time')
    expect(metricFor('marathon')).toBe('time')
  })

  it('trace l’allure là où chaque course a sa propre distance', () => {
    expect(metricFor('trail')).toBe('pace')
    expect(metricFor('ultra')).toBe('pace')
    expect(metricFor('other')).toBe('pace')
  })
})

describe('paceSecondsOf', () => {
  it('divise la durée par la distance en kilomètres', () => {
    expect(
      paceSecondsOf(race({ name: 'dix', date: '2026-01-01', duration: '45:00' })),
    ).toBe(270)
  })

  it('refuse de diviser par une distance absente', () => {
    expect(
      paceSecondsOf(
        race({ name: 'sans', date: '2026-01-01', duration: '45:00', distance: 0 }),
      ),
    ).toBeNull()
  })
})

describe('buildCurve', () => {
  const journal = [
    race({ name: 'dix 2026', date: '2026-02-15', duration: '43:12' }),
    race({ name: 'dix 2022', date: '2022-04-10', duration: '48:00' }),
    race({ name: 'semi', date: '2025-07-05', duration: '1:38:20', type: 'semi', distance: 21.1 }),
  ]

  it('range la série du plus ancien au plus récent', () => {
    const curve = buildCurve(journal, '10k')
    expect(curve.metric).toBe('time')
    expect(curve.points.map((p) => p.race.name)).toEqual(['dix 2022', 'dix 2026'])
    expect(curve.points.map((p) => p.value)).toEqual([2880, 2592])
  })

  it('ne mélange pas les types', () => {
    expect(buildCurve(journal, 'semi').points).toHaveLength(1)
    expect(buildCurve(journal, 'trail').points).toEqual([])
  })

  it('porte l’allure quand la distance est libre', () => {
    const curve = buildCurve(
      [
        race({ name: 'court', date: '2025-05-24', duration: '2:58:00', type: 'trail', distance: 24 }),
        race({ name: 'long', date: '2026-06-14', duration: '4:12:00', type: 'trail', distance: 32 }),
      ],
      'trail',
    )
    expect(curve.metric).toBe('pace')
    // 2 h 58 sur 24 km, puis 4 h 12 sur 32 km : le second est plus lent au
    // kilomètre, alors qu'il est le plus long — c'est tout l'intérêt.
    expect(curve.points.map((p) => Math.round(p.value))).toEqual([445, 473])
  })

  it('écarte ce qui ne peut pas être posé sur un axe', () => {
    const curve = buildCurve(
      [
        race({ name: 'date illisible', date: '2026-02-31', duration: '45:00' }),
        race({ name: 'sans durée', date: '2026-03-01', duration: '' }),
        race({ name: 'bonne', date: '2026-04-01', duration: '45:00' }),
      ],
      '10k',
    )
    expect(curve.points.map((p) => p.race.name)).toEqual(['bonne'])
  })

  it('départage deux courses du même jour sans dépendre de la saisie', () => {
    const sameDay = [
      race({ name: 'lente', date: '2026-01-01', duration: '48:00' }),
      race({ name: 'rapide', date: '2026-01-01', duration: '43:00' }),
    ]
    expect(buildCurve(sameDay, '10k').points.map((p) => p.race.name)).toEqual([
      'rapide',
      'lente',
    ])
    expect(
      buildCurve(sameDay.slice().reverse(), '10k').points.map((p) => p.race.name),
    ).toEqual(['rapide', 'lente'])
  })
})

describe('curveScale', () => {
  const scaleOf = (durations: string[]) =>
    curveScale(
      buildCurve(
        durations.map((duration, index) =>
          race({ name: `c${index}`, date: `2026-0${index + 1}-01`, duration }),
        ),
        '10k',
      ).points,
    )

  it('gradue sur des valeurs rondes, pas sur des parts égales', () => {
    // 40:00 → 50:00, soit 600 s d'amplitude : le pas de 300 s (cinq minutes)
    // est le premier de l'échelle qui tienne en quatre graduations.
    const scale = scaleOf(['40:00', '50:00'])
    expect(scale?.ticks).toEqual([2400, 2700, 3000])
    expect(scale?.min).toBe(2400)
    expect(scale?.max).toBe(3000)
  })

  it('encadre les valeurs sans jamais les couper', () => {
    const scale = scaleOf(['43:12', '45:00'])
    expect(scale?.min).toBeLessThanOrEqual(2592)
    expect(scale?.max).toBeGreaterThanOrEqual(2700)
  })

  it('donne une hauteur à une série parfaitement plate', () => {
    const scale = scaleOf(['45:00', '45:00'])
    expect(scale?.min).toBeLessThan(2700)
    expect(scale?.max).toBeGreaterThan(2700)
    expect(scale?.ticks.length).toBeGreaterThan(1)
  })

  it('ne descend jamais sous zéro', () => {
    const scale = scaleOf(['0:30', '2:00'])
    expect(scale?.min).toBeGreaterThanOrEqual(0)
  })

  it('n’a rien à graduer sans point', () => {
    expect(curveScale([])).toBeNull()
  })
})

describe('yearTicks', () => {
  it('ne pose qu’une graduation par année, sur une vraie course', () => {
    const points = buildCurve(
      [
        race({ name: 'a', date: '2026-02-15', duration: '43:12' }),
        race({ name: 'b', date: '2026-09-20', duration: '44:00' }),
        race({ name: 'c', date: '2022-04-10', duration: '48:00' }),
      ],
      '10k',
    ).points

    const ticks = yearTicks(points)
    expect(ticks).toHaveLength(2)
    expect(ticks.map((t) => new Date(t).getFullYear())).toEqual([2022, 2026])
    // Chaque graduation est la position d'un point : elle tombe donc toujours
    // dans le cadre, quelle que soit la marge de l'axe.
    expect(points.map((point) => point.t)).toEqual(expect.arrayContaining(ticks))
  })

  it('n’a rien à graduer sans point', () => {
    expect(yearTicks([])).toEqual([])
  })
})

describe('timeBounds', () => {
  it('ouvre un cadre autour d’un point seul', () => {
    const points = buildCurve(
      [race({ name: 'seule', date: '2026-01-01', duration: '45:00' })],
      '10k',
    ).points
    const bounds = timeBounds(points)
    expect(bounds?.min).toBeLessThan(points[0]?.t ?? 0)
    expect(bounds?.max).toBeGreaterThan(points[0]?.t ?? 0)
  })

  it('n’a rien à borner sans point', () => {
    expect(timeBounds([])).toBeNull()
  })
})
