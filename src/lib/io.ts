/** race.json — lecture, écriture, fusion, partage.
 *  Import validé contre le schéma, jamais d'écrasement silencieux. */

import { RACE_TYPES, SCHEMA_VERSION } from './types.ts'
import type { Race, RaceFile, RaceType, Settings } from './types.ts'

export const EXPORT_FILENAME = 'race.json'

export type ParseResult =
  | { ok: true; file: RaceFile }
  | { ok: false; reason: 'unreadable' | 'schema' | 'version' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asType(value: unknown): RaceType {
  return RACE_TYPES.includes(value as RaceType) ? (value as RaceType) : 'other'
}

function asRace(value: unknown, index: number): Race | null {
  if (!isRecord(value)) return null
  const date = asString(value.date)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null
  const distance = Number(value.distance)
  if (!Number.isFinite(distance) || distance <= 0) return null
  const elevation = Number(value.elevationGain)
  return {
    id: asString(value.id) || `imported-${index}-${date}`,
    type: asType(value.type),
    name: asString(value.name).trim() || date,
    date,
    distance,
    duration: asString(value.duration),
    elevationGain: Number.isFinite(elevation) && elevation > 0 ? elevation : null,
    location: asString(value.location),
    notes: asString(value.notes),
  }
}

function asSettings(value: unknown): Partial<Settings> {
  if (!isRecord(value)) return {}
  const out: Partial<Settings> = {}
  const pick = <K extends keyof Settings>(
    key: K,
    allowed: readonly Settings[K][],
  ): void => {
    const v = value[key]
    if (allowed.includes(v as Settings[K])) out[key] = v as Settings[K]
  }
  pick('theme', ['system', 'light', 'dark'])
  pick('lang', ['system', 'fr', 'en'])
  pick('unit', ['km', 'mi'])
  pick('pace', ['shown', 'hidden'])
  pick('defaultView', ['list', 'year', 'month'])
  return out
}

/** Parse une chaîne JSON en fichier race. Les courses illisibles sont
 *  écartées une à une : un enregistrement cassé ne perd pas les autres. */
export function parseFile(text: string): ParseResult {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'unreadable' }
  }
  if (!isRecord(raw)) return { ok: false, reason: 'schema' }

  const version = Number(raw.schemaVersion)
  if (!Number.isFinite(version)) return { ok: false, reason: 'schema' }
  if (version !== SCHEMA_VERSION) return { ok: false, reason: 'version' }

  const data = isRecord(raw.data) ? raw.data : null
  if (!data || !Array.isArray(data.races)) return { ok: false, reason: 'schema' }

  const races = data.races
    .map((r, i) => asRace(r, i))
    .filter((r): r is Race => r !== null)

  return {
    ok: true,
    file: {
      schemaVersion: SCHEMA_VERSION,
      data: { races },
      settings: asSettings(raw.settings),
    },
  }
}

export function serializeFile(file: RaceFile): string {
  return `${JSON.stringify(file, null, 2)}\n`
}

/** Deux courses sont la même si elles portent le même nom le même jour.
 *  L'identifiant, lui, est local à un appareil. */
function sameRace(a: Race, b: Race): boolean {
  return (
    a.date === b.date &&
    a.name.trim().toLowerCase() === b.name.trim().toLowerCase()
  )
}

export interface MergeResult {
  races: Race[]
  added: number
  skipped: number
}

/** Fusionner ajoute les courses absentes et garde les vôtres. */
export function mergeRaces(current: Race[], incoming: Race[]): MergeResult {
  const added: Race[] = []
  for (const race of incoming) {
    const existing = current.some((r) => sameRace(r, race))
    const duplicate = added.some((r) => sameRace(r, race))
    if (!existing && !duplicate) added.push(race)
  }
  return {
    races: current.concat(added),
    added: added.length,
    skipped: incoming.length - added.length,
  }
}

function fileBlob(file: RaceFile): Blob {
  return new Blob([serializeFile(file)], { type: 'application/json' })
}

/** Déclenche le téléchargement du fichier. Aucun réseau : un Blob local. */
export function downloadFile(file: RaceFile, filename = EXPORT_FILENAME): void {
  const url = URL.createObjectURL(fileBlob(file))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** Envoyer vers : le partage natif quand l'appareil sait recevoir un
 *  fichier, le téléchargement sinon. Le contenu ne quitte l'appareil que
 *  par le geste explicite de l'utilisateur, vers l'application qu'il
 *  choisit — jamais vers un serveur du projet, il n'y en a pas. */
export async function shareFile(
  file: RaceFile,
  filename = EXPORT_FILENAME,
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const nav = typeof navigator === 'undefined' ? null : navigator
  if (nav && typeof nav.share === 'function' && typeof File === 'function') {
    const payload = new File([fileBlob(file)], filename, {
      type: 'application/json',
    })
    const canShare = nav.canShare?.({ files: [payload] }) ?? false
    if (canShare) {
      try {
        await nav.share({ files: [payload], title: filename })
        return 'shared'
      } catch (error) {
        // Refus de l'utilisateur : ce n'est pas une panne, on n'enchaîne
        // pas sur un téléchargement qu'il n'a pas demandé.
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'cancelled'
        }
      }
    }
  }
  downloadFile(file, filename)
  return 'downloaded'
}
