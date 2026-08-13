/** Formatage des durées, distances, allures et dates.
 *  Toute valeur affichée passe par ici ; rien n'est formaté en base. */

import type { Race, UnitSetting } from './types.ts'

const pad = (n: number): string => String(n).padStart(2, '0')

/** Convertit « h:mm:ss » ou « mm:ss » en secondes. 0 si illisible. */
export function toSeconds(duration: string): number {
  const parts = String(duration ?? '')
    .trim()
    .split(':')
    .map(Number)
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return 0
  if (parts.length === 3) {
    return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0)
  }
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0)
  return 0
}

/** « 46h30:00 » pour les heures, « 45:00 » en dessous. */
export function formatDuration(duration: string): string {
  const total = toSeconds(duration)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}h${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

/** Range une frappe en « h:mm:ss ».
 *
 *  Le clavier d'un téléphone n'offre pas de « : » sur un pavé numérique :
 *  sans cela, la durée y serait tout bonnement impossible à saisir. Les
 *  chiffres se rangent donc depuis la droite — secondes, puis minutes,
 *  puis heures — et les séparateurs apparaissent d'eux-mêmes. Rejouer le
 *  masque sur son propre résultat ne déplace rien : corriger une course
 *  déjà enregistrée reste sûr. */
export function maskDurationInput(raw: string): string {
  const digits = String(raw ?? '')
    .replace(/\D/g, '')
    .slice(0, 7)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, -2)}:${digits.slice(-2)}`
  return `${digits.slice(0, -4)}:${digits.slice(-4, -2)}:${digits.slice(-2)}`
}

/** Réécrit un nombre de secondes en durée canonique, pour un écart. */
export function secondsToDuration(total: number): string {
  const t = Math.max(0, Math.round(total))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

const KM_PER_MILE = 0.621371
const FEET_PER_METRE = 3.28084

export interface UnitSystem {
  /** Facteur appliqué aux kilomètres stockés. */
  factor: number
  /** Suffixe de distance. */
  distance: 'km' | 'mi'
  /** Suffixe de dénivelé. */
  elevation: 'm' | 'ft'
}

export function unitSystem(unit: UnitSetting): UnitSystem {
  return unit === 'km'
    ? { factor: 1, distance: 'km', elevation: 'm' }
    : { factor: KM_PER_MILE, distance: 'mi', elevation: 'ft' }
}

export function formatDistance(
  km: number,
  unit: UnitSetting,
  locale: string,
): string {
  const u = unitSystem(unit)
  const value = Math.round(Number(km) * u.factor * 10) / 10
  const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
    value,
  )
  return `${n} ${u.distance}`
}

export function formatElevation(
  metres: number,
  unit: UnitSetting,
  locale: string,
): string {
  const u = unitSystem(unit)
  const value = Math.round(unit === 'km' ? metres : metres * FEET_PER_METRE)
  return `${new Intl.NumberFormat(locale).format(value)} ${u.elevation}`
}

/** Une allure déjà calculée, en secondes par kilomètre — l'unité du stockage —
 *  rendue dans celle qui est réglée : « 4:30/km » ou « 7:14/mi ». */
export function formatPaceSeconds(
  secondsPerKm: number,
  unit: UnitSetting,
): string {
  if (!Number.isFinite(secondsPerKm) || secondsPerKm <= 0) return ''
  const u = unitSystem(unit)
  const perUnit = Math.round(secondsPerKm / u.factor)
  return `${Math.floor(perUnit / 60)}:${pad(perUnit % 60)}/${u.distance}`
}

/** Allure par unité de distance : « 4:30/km ». Vide si la distance est nulle. */
export function formatPace(race: Race, unit: UnitSetting): string {
  const km = Number(race.distance)
  if (!km) return ''
  return formatPaceSeconds(toSeconds(race.duration) / km, unit)
}

/** Parse une date ISO en date locale — sans décalage de fuseau. */
export function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''))
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  // Rejette 2026-02-31, que Date « corrigerait » silencieusement.
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return date
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function formatDate(iso: string, locale: string): string {
  const date = parseISODate(iso)
  if (!date) return iso ?? ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function monthName(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(
    new Date(2026, month, 1),
  )
}

export function monthNameShort(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(
    new Date(2026, month, 1),
  )
}

/** « ven 28 » — jour abrégé puis quantième sur deux chiffres. */
export function dayKey(date: Date, locale: string): string {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    .format(date)
    .replace(/\.$/, '')
  return `${weekday} ${pad(date.getDate())}`
}

/** Nombre de jours couverts par une course, d'après sa durée. */
export function spanDays(race: Race): number {
  return Math.max(1, Math.ceil(toSeconds(race.duration) / 86400))
}
