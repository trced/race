/** Courbes : une série par type de course, dans l'ordre du temps.
 *  Un point par course, rien entre deux — aucune valeur n'est inventée. */

import { parseISODate, toSeconds } from './format.ts'
import { RACE_TYPES, STANDARD_DISTANCE } from './types.ts'
import type { Race, RaceType } from './types.ts'

/** Le temps ne se compare qu'à distance égale. Là où le format n'en impose
 *  aucune, c'est l'allure qui reste comparable d'une course à l'autre. */
export type CurveMetric = 'time' | 'pace'

export interface CurvePoint {
  race: Race
  iso: string
  /** Millisecondes depuis l'époque : l'axe est un temps, pas un rang. */
  t: number
  seconds: number
  /** Secondes par kilomètre, ou null quand la distance est nulle. */
  paceSeconds: number | null
  /** La valeur portée par l'axe, métrique de la série comprise. */
  value: number
}

export interface Curve {
  type: RaceType
  metric: CurveMetric
  /** Du plus ancien au plus récent. */
  points: CurvePoint[]
}

/** Les types présents, dans l'ordre déclaré — jamais celui de la saisie. */
export function curveTypes(races: Race[]): RaceType[] {
  return RACE_TYPES.filter((type) => races.some((race) => race.type === type))
}

export function metricFor(type: RaceType): CurveMetric {
  return STANDARD_DISTANCE[type] === null ? 'pace' : 'time'
}

export function paceSecondsOf(race: Race): number | null {
  const km = Number(race.distance)
  const seconds = toSeconds(race.duration)
  if (!Number.isFinite(km) || km <= 0 || seconds <= 0) return null
  return seconds / km
}

/** La série d'un type. Une course qu'on ne saurait où poser — date illisible,
 *  durée absente, distance nulle sur une série en allure — est écartée. */
export function buildCurve(races: Race[], type: RaceType): Curve {
  const metric = metricFor(type)

  const points = races
    .filter((race) => race.type === type)
    .map((race): CurvePoint | null => {
      const date = parseISODate(race.date)
      if (!date) return null

      const seconds = toSeconds(race.duration)
      if (seconds <= 0) return null

      const paceSeconds = paceSecondsOf(race)
      const value = metric === 'pace' ? paceSeconds : seconds
      if (value === null) return null

      return { race, iso: race.date, t: date.getTime(), seconds, paceSeconds, value }
    })
    .filter((point): point is CurvePoint => point !== null)
    // Deux courses le même jour : la plus rapide d'abord, puis l'identifiant.
    // Un tri qui suivrait la saisie ferait bouger le tracé tout seul.
    .sort((a, b) => {
      if (a.t !== b.t) return a.t - b.t
      if (a.value !== b.value) return a.value - b.value
      return a.race.id < b.race.id ? -1 : 1
    })

  return { type, metric, points }
}

export interface CurveBounds {
  min: number
  max: number
}

export interface CurveScale extends CurveBounds {
  ticks: number[]
}

/** Durées qui se lisent. Un axe découpé en parts égales donne « 3h43:23 ». */
const TIME_STEPS = [
  5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 10800, 21600,
]

export function niceStep(span: number, divisions = 4): number {
  const raw = span / divisions
  return TIME_STEPS.find((step) => step >= raw) ?? TIME_STEPS[TIME_STEPS.length - 1]!
}

/** L'axe vertical : bornes alignées sur le pas, graduations dessus. Une série
 *  plate n'a aucune amplitude — on lui en ouvre une autour de sa valeur. */
export function curveScale(points: CurvePoint[]): CurveScale | null {
  if (points.length === 0) return null

  const values = points.map((point) => point.value)
  const low = Math.min(...values)
  const high = Math.max(...values)
  const flat = high === low
  const step = niceStep(flat ? Math.max(60, high / 10) : high - low)

  const min = Math.max(0, Math.floor((flat ? low - step : low) / step) * step)
  const max = Math.ceil((flat ? high + step : high) / step) * step

  const ticks: number[] = []
  for (let value = min; value <= max + step / 2; value += step) ticks.push(value)

  return { min, max, ticks }
}

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

/** L'axe horizontal. Un point seul n'a pas d'étendue : on lui ouvre une année
 *  de part et d'autre pour qu'il se pose au milieu du cadre. */
export function timeBounds(points: CurvePoint[]): CurveBounds | null {
  if (points.length === 0) return null

  const times = points.map((point) => point.t)
  const first = Math.min(...times)
  const last = Math.max(...times)
  if (first === last) return { min: first - YEAR_MS, max: last + YEAR_MS }

  const margin = (last - first) / 20
  return { min: first - margin, max: last + margin }
}

/** Une graduation par année, posée sur la première course de cette année-là.
 *  Livrée à elle-même, l'échelle en pose deux dans la même année et le
 *  libellé écrit « 2026 » deux fois. */
export function yearTicks(points: CurvePoint[]): number[] {
  const seen = new Set<string>()
  const ticks: number[] = []

  for (const point of points) {
    const year = point.iso.slice(0, 4)
    if (seen.has(year)) continue
    seen.add(year)
    ticks.push(point.t)
  }

  return ticks
}
