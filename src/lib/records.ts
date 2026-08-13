/** Records : meilleur temps par distance, extrêmes, totaux.
 *  Ici le chiffre suffit : un record est une valeur, pas une tendance. Ce qui
 *  bouge dans le temps se lit dans les Courbes — voir lib/curves.ts. */

import { toSeconds } from './format.ts'
import type { Race } from './types.ts'

export interface RecordCategory {
  /** Clé i18n du libellé de catégorie. */
  key: string
  /** Distance de référence, en kilomètres. */
  km: number
}

/** Tri fixe et prévisible, jamais par valeur. */
export const RECORD_CATEGORIES: RecordCategory[] = [
  { key: 'app.records.cat.5k', km: 5 },
  { key: 'app.records.cat.10k', km: 10 },
  { key: 'app.records.cat.semi', km: 21.1 },
  { key: 'app.records.cat.marathon', km: 42.2 },
]

/** Tolérance sur la distance : un 10 km mesuré 10,1 reste un 10 km. */
const TOLERANCE = 0.02

export interface RecordEntry {
  category: RecordCategory
  /** null quand aucune course n'entre dans la catégorie. */
  best: Race | null
  /** Nombre de courses de la catégorie. */
  count: number
  /** Écart en secondes avec la deuxième, ou null s'il n'y en a pas. */
  gapSeconds: number | null
}

export function computeRecords(races: Race[]): RecordEntry[] {
  return RECORD_CATEGORIES.map((category) => {
    const pool = races
      .filter(
        (r) => Math.abs(Number(r.distance) - category.km) <= category.km * TOLERANCE,
      )
      .sort((a, b) => toSeconds(a.duration) - toSeconds(b.duration))

    const best = pool[0] ?? null
    const second = pool[1] ?? null
    return {
      category,
      best,
      count: pool.length,
      gapSeconds:
        best && second
          ? toSeconds(second.duration) - toSeconds(best.duration)
          : null,
    }
  })
}

export interface Totals {
  races: number
  km: number
  elevation: number
  longest: Race | null
  steepest: Race | null
}

export function computeTotals(races: Race[]): Totals {
  const longest = races.reduce<Race | null>(
    (acc, r) => (!acc || Number(r.distance) > Number(acc.distance) ? r : acc),
    null,
  )
  const steepest = races.reduce<Race | null>((acc, r) => {
    if (!r.elevationGain) return acc
    return !acc || r.elevationGain > (acc.elevationGain ?? 0) ? r : acc
  }, null)

  return {
    races: races.length,
    km: races.reduce((sum, r) => sum + Number(r.distance), 0),
    elevation: races.reduce((sum, r) => sum + (Number(r.elevationGain) || 0), 0),
    longest,
    steepest,
  }
}
