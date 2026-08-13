/** Courbes : une série par type de course, dans l'ordre du temps.
 *  Rien n'est lissé, rien n'est extrapolé — un point par course, et le vide
 *  entre deux courses reste du vide. La courbe ne juge pas : elle montre. */

import { parseISODate, toSeconds } from './format.ts'
import { RACE_TYPES, STANDARD_DISTANCE } from './types.ts'
import type { Race, RaceType } from './types.ts'

/** Ce que porte l'axe vertical.
 *
 *  Le temps ne se compare qu'à distance égale : deux 10 km se lisent l'un
 *  contre l'autre, deux trails de 24 et 32 km ne se lisent pas. Là où le
 *  format n'impose aucune distance — trail, ultra, autre — c'est l'allure
 *  qui reste comparable, et c'est elle qu'on trace. */
export type CurveMetric = 'time' | 'pace'

export interface CurvePoint {
  race: Race
  /** Date ISO — ce que la course dit d'elle-même. */
  iso: string
  /** Millisecondes depuis l'époque. L'axe horizontal est un temps, pas un
   *  rang : trois ans sans course doivent se voir comme trois ans. */
  t: number
  /** Durée de la course, en secondes. */
  seconds: number
  /** Secondes par kilomètre, ou null quand la distance est nulle. */
  paceSeconds: number | null
  /** La valeur portée par l'axe, métrique de la série comprise. */
  value: number
}

export interface Curve {
  type: RaceType
  metric: CurveMetric
  /** Du plus ancien au plus récent : une évolution se lit vers la droite. */
  points: CurvePoint[]
}

/** Les types réellement présents, dans l'ordre déclaré par RACE_TYPES.
 *  Jamais celui des données : une liste qui se réordonne toute seule au fil
 *  des saisies ne se retrouve pas d'une fois sur l'autre. */
export function curveTypes(races: Race[]): RaceType[] {
  return RACE_TYPES.filter((type) => races.some((race) => race.type === type))
}

/** Distance officielle → le temps se compare. Distance libre → l'allure. */
export function metricFor(type: RaceType): CurveMetric {
  return STANDARD_DISTANCE[type] === null ? 'pace' : 'time'
}

/** Secondes par kilomètre, ou null si la distance ne permet pas le calcul.
 *  L'allure d'affichage suit l'unité réglée ; celle-ci reste en kilomètres,
 *  comme le stockage — c'est la vue qui convertit, jamais le calcul. */
export function paceSecondsOf(race: Race): number | null {
  const km = Number(race.distance)
  const seconds = toSeconds(race.duration)
  if (!Number.isFinite(km) || km <= 0 || seconds <= 0) return null
  return seconds / km
}

/** La série d'un type. Une course sans date lisible, sans durée ou — pour une
 *  série en allure — sans distance, n'a pas de point : elle serait posée au
 *  hasard sur l'axe, ce qui est pire que de manquer. */
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

      return {
        race,
        iso: race.date,
        t: date.getTime(),
        seconds,
        paceSeconds,
        value,
      }
    })
    .filter((point): point is CurvePoint => point !== null)
    // Deux courses le même jour : la plus rapide d'abord, puis l'identifiant.
    // Un tri qui dépend de l'ordre de saisie ferait bouger le tracé tout seul.
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
  /** Les valeurs graduées, du bas vers le haut. */
  ticks: number[]
}

/** Pas de graduation, pris dans une échelle de durées qui se lisent : quart
 *  de minute, minute, cinq minutes, quart d'heure, heure. Personne ne lit
 *  « 3h43:23 » — c'est ce que donne un axe découpé en parts égales entre
 *  deux temps quelconques. */
const TIME_STEPS = [
  5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 10800, 21600,
]

export function niceStep(span: number, divisions = 4): number {
  const raw = span / divisions
  return TIME_STEPS.find((step) => step >= raw) ?? TIME_STEPS[TIME_STEPS.length - 1]!
}

/** L'axe vertical : des bornes alignées sur le pas, et les graduations qui
 *  tombent dessus. Une série plate — deux fois le même temps — n'a aucune
 *  amplitude : on lui en ouvre une autour de sa valeur, faute de quoi la
 *  ligne se colle au bord du cadre. */
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

/** Les bornes de l'axe horizontal. Un point seul n'a pas d'étendue : on lui
 *  ouvre une année de part et d'autre pour qu'il se pose au milieu du cadre
 *  au lieu de disparaître dans son bord. */
const YEAR_MS = 365 * 24 * 60 * 60 * 1000

export function timeBounds(points: CurvePoint[]): CurveBounds | null {
  if (points.length === 0) return null

  const times = points.map((point) => point.t)
  const first = Math.min(...times)
  const last = Math.max(...times)
  if (first === last) return { min: first - YEAR_MS, max: last + YEAR_MS }

  const margin = (last - first) / 20
  return { min: first - margin, max: last + margin }
}

/** Une graduation par année couverte, posée sur la première course de cette
 *  année-là. Laissée à elle-même, l'échelle de temps place ses graduations où
 *  elle veut — deux dans la même année, et le libellé écrit « 2026 » deux
 *  fois. Une position tirée des données tombe toujours dans le cadre. */
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
