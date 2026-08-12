/** Modèle de données de race. Une course est l'unité, rien d'autre. */

export const RACE_TYPES = [
  '5k',
  '10k',
  'semi',
  'marathon',
  'trail',
  'ultra',
  'other',
] as const

export type RaceType = (typeof RACE_TYPES)[number]

/** Distance officielle en km, ou null quand le format n'en impose aucune. */
export const STANDARD_DISTANCE: Record<RaceType, number | null> = {
  '5k': 5,
  '10k': 10,
  semi: 21.1,
  marathon: 42.2,
  trail: null,
  ultra: null,
  other: null,
}

export interface Race {
  id: string
  type: RaceType
  name: string
  /** ISO 8601, AAAA-MM-JJ. Aucune date formatée en base. */
  date: string
  /** Kilomètres. L'unité d'affichage est un réglage, pas un stockage. */
  distance: number
  /** h:mm:ss ou mm:ss. */
  duration: string
  /** Mètres, ou null. */
  elevationGain: number | null
  location: string
  notes: string
}

export type ThemeSetting = 'system' | 'light' | 'dark'
export type LangSetting = 'system' | 'fr' | 'en'
export type UnitSetting = 'km' | 'mi'
export type PaceSetting = 'shown' | 'hidden'
export type ViewSetting = 'list' | 'year' | 'month'

export interface Settings {
  theme: ThemeSetting
  lang: LangSetting
  unit: UnitSetting
  pace: PaceSetting
  defaultView: ViewSetting
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  lang: 'system',
  unit: 'km',
  pace: 'shown',
  defaultView: 'list',
}

export const SCHEMA_VERSION = 1

/** Le fichier race.json — le seul format d'échange du projet. */
export interface RaceFile {
  schemaVersion: number
  data: { races: Race[] }
  settings: Partial<Settings>
}
