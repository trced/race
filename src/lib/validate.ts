/** Validation du formulaire de course.
 *  Renvoie des clés i18n, pas des phrases : le message se traduit à l'affichage. */

import { parseISODate } from './format.ts'

/** Les valeurs telles que saisies : tout est chaîne avant d'être validé. */
export interface RaceDraft {
  id: string
  type: string
  name: string
  date: string
  distance: string
  duration: string
  elevationGain: string
  location: string
  notes: string
}

export type FieldName = 'name' | 'date' | 'distance' | 'duration'

export type ValidationErrors = Partial<Record<FieldName, string>>

/** Accepte « 45:00 », « 3:45:00 », « 46:30:00 » — pas « 3:75 » ni « 45 ». */
const DURATION = /^\d{1,3}(:[0-5]\d){1,2}$/

export function parseDistance(raw: string): number {
  return Number(String(raw ?? '').replace(',', '.'))
}

export function validateDraft(draft: RaceDraft): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!String(draft.name ?? '').trim()) {
    errors.name = 'app.edit.error.name'
  }

  const raw = String(draft.date ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    errors.date = 'app.edit.error.dateFormat'
  } else if (!parseISODate(raw)) {
    errors.date = 'app.edit.error.dateUnreal'
  }

  const km = parseDistance(draft.distance)
  if (!Number.isFinite(km) || km <= 0) {
    errors.distance = 'app.edit.error.distance'
  }

  if (!DURATION.test(String(draft.duration ?? '').trim())) {
    errors.duration = 'app.edit.error.duration'
  }

  return errors
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}
