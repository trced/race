/** Formatage lié aux réglages courants : unité, allure, locale.
 *  Les vues n'appellent jamais les fonctions brutes de lib/format. */

import { useMemo } from 'react'
import { useI18n } from '../i18n/index.tsx'
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
  formatPace,
  unitSystem,
} from '../lib/format.ts'
import type { Race } from '../lib/types.ts'
import { useStore } from '../state/store.tsx'

export interface Formatter {
  distance: (km: number) => string
  elevation: (metres: number) => string
  duration: (value: string) => string
  pace: (race: Race) => string
  date: (iso: string) => string
  /** « 10 km – 45:00 (4:30/km) – D+ 120 m », précédé du type si demandé. */
  meta: (race: Race, withType?: boolean) => string
  typeLabel: (race: Race) => string
  distanceUnit: string
  elevationUnit: string
}

export function useFormat(): Formatter {
  const { settings } = useStore()
  const { locale, t } = useI18n()
  const unit = settings.unit
  const showPace = settings.pace === 'shown'

  return useMemo(() => {
    const system = unitSystem(unit)
    const typeLabel = (race: Race): string =>
      t(`app.type.${race.type}` as Parameters<typeof t>[0])

    const meta = (race: Race, withType = false): string => {
      const parts: string[] = []
      if (withType) parts.push(typeLabel(race))
      parts.push(formatDistance(race.distance, unit, locale))
      const pace = showPace ? formatPace(race, unit) : ''
      parts.push(
        formatDuration(race.duration) + (pace ? ` (${pace})` : ''),
      )
      if (race.elevationGain) {
        parts.push(`D+ ${formatElevation(race.elevationGain, unit, locale)}`)
      }
      return parts.join(' – ')
    }

    return {
      distance: (km) => formatDistance(km, unit, locale),
      elevation: (metres) => formatElevation(metres, unit, locale),
      duration: formatDuration,
      pace: (race) => formatPace(race, unit),
      date: (iso) => formatDate(iso, locale),
      meta,
      typeLabel,
      distanceUnit: system.distance,
      elevationUnit: system.elevation,
    }
  }, [unit, locale, showPace, t])
}
