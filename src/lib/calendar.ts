/** Construction de la vue Mois : une ligne par jour, les creux repliés,
 *  les courses de plusieurs jours prolongées par un trait. */

import { spanDays, toISODate } from './format.ts'
import type { Race } from './types.ts'

export interface DayEntry {
  kind: 'day'
  iso: string
  date: Date
  /** La course qui commence ce jour-là. */
  race: Race | null
  /** La course qui se poursuit ce jour-là, sans y commencer. */
  continuation: Race | null
  /** Trait montant : la veille faisait déjà partie de la course. */
  lineUp: boolean
  /** Trait descendant : le lendemain en fait encore partie. */
  lineDown: boolean
}

export interface GapEntry {
  kind: 'gap'
  days: number
}

export type MonthEntry = DayEntry | GapEntry

/** Un creux n'est replié qu'à partir de trois jours : en dessous, la
 *  ligne vide coûte moins cher à lire que l'abréviation. */
const MIN_GAP = 3

/** Jours couverts par une course, hors jour de départ. */
function continuationDates(race: Race): string[] {
  const total = spanDays(race)
  if (total < 2) return []
  const start = new Date(`${race.date}T00:00:00`)
  if (Number.isNaN(start.getTime())) return []
  const out: string[] = []
  for (let k = 1; k < total; k++) {
    out.push(toISODate(new Date(start.getTime() + k * 86400000)))
  }
  return out
}

export function buildMonth(
  races: Race[],
  year: number,
  month: number,
): MonthEntry[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Index des continuations : jour ISO → course, et si c'est le dernier jour.
  const continuations = new Map<string, { race: Race; last: boolean }>()
  for (const race of races) {
    const dates = continuationDates(race)
    dates.forEach((iso, i) => {
      continuations.set(iso, { race, last: i === dates.length - 1 })
    })
  }

  const raw: DayEntry[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const iso = toISODate(date)
    const race = races.find((r) => r.date === iso) ?? null
    const cont = continuations.get(iso) ?? null
    raw.push({
      kind: 'day',
      iso,
      date,
      race,
      continuation: race ? null : (cont?.race ?? null),
      lineUp: !race && !!cont,
      lineDown:
        (!!race && spanDays(race) > 1) || (!race && !!cont && !cont.last),
    })
  }

  const out: MonthEntry[] = []
  for (let i = 0; i < raw.length; i++) {
    const entry = raw[i]!
    if (entry.race || entry.continuation) {
      out.push(entry)
      continue
    }
    let j = i
    while (j < raw.length && !raw[j]!.race && !raw[j]!.continuation) j++
    const run = j - i
    if (run >= MIN_GAP) {
      out.push({ kind: 'gap', days: run })
    } else {
      for (let k = i; k < j; k++) out.push(raw[k]!)
    }
    i = j - 1
  }
  return out
}

/** Nombre de courses commencées dans chaque mois d'une année. */
export function countByMonth(races: Race[], year: number): number[] {
  const counts = new Array<number>(12).fill(0)
  for (const race of races) {
    const m = /^(\d{4})-(\d{2})/.exec(race.date)
    if (!m || Number(m[1]) !== year) continue
    const index = Number(m[2]) - 1
    if (index >= 0 && index < 12) counts[index] = (counts[index] ?? 0) + 1
  }
  return counts
}
