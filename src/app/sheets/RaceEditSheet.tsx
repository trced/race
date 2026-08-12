/** Formulaire de course. Quatre champs obligatoires, trois facultatifs.
 *  Les erreurs apparaissent à la validation, pas à chaque frappe. */

import { useMemo, useState } from 'react'
import { Button } from '../../components/Button.tsx'
import { Confirm } from '../../components/Feedback.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import {
  SelectField,
  TextAreaField,
  TextField,
} from '../../components/TextField.tsx'
import { useI18n } from '../../i18n/index.tsx'
import type { MessageKey } from '../../i18n/index.tsx'
import { unitSystem } from '../../lib/format.ts'
import {
  RACE_TYPES,
  STANDARD_DISTANCE,
  type Race,
  type RaceType,
  type UnitSetting,
} from '../../lib/types.ts'
import {
  parseDistance,
  validateDraft,
  type RaceDraft,
  type ValidationErrors,
} from '../../lib/validate.ts'
import { useFormat } from '../useFormat.ts'
import { useStore } from '../../state/store.tsx'

const FEET_PER_METRE = 3.28084

function round1(value: number): number {
  return Math.round(value * 10) / 10
}

/** Une distance stockée en km, écrite dans l'unité affichée. */
function distanceToDraft(km: number, unit: UnitSetting): string {
  return String(round1(km * unitSystem(unit).factor))
}

function draftToKm(raw: string, unit: UnitSetting): number {
  return parseDistance(raw) / unitSystem(unit).factor
}

function elevationToDraft(metres: number | null, unit: UnitSetting): string {
  if (!metres) return ''
  return String(Math.round(unit === 'km' ? metres : metres * FEET_PER_METRE))
}

function draftToMetres(raw: string, unit: UnitSetting): number | null {
  const value = Number(String(raw).replace(',', '.'))
  if (!Number.isFinite(value) || value <= 0) return null
  return Math.round(unit === 'km' ? value : value / FEET_PER_METRE)
}

export function toDraft(race: Race, unit: UnitSetting): RaceDraft {
  return {
    id: race.id,
    type: race.type,
    name: race.name,
    date: race.date,
    distance: distanceToDraft(race.distance, unit),
    duration: race.duration,
    elevationGain: elevationToDraft(race.elevationGain, unit),
    location: race.location,
    notes: race.notes,
  }
}

export function emptyDraft(today: string, unit: UnitSetting): RaceDraft {
  return {
    id: 'new',
    type: '10k',
    name: '',
    date: today,
    distance: distanceToDraft(10, unit),
    duration: '',
    elevationGain: '',
    location: '',
    notes: '',
  }
}

export function RaceEditSheet({
  draft: initial,
  isNew,
  original,
  onClose,
  onSave,
  onDelete,
}: {
  draft: RaceDraft
  isNew: boolean
  /** La course avant modification — sert à ne pas réécrire une valeur
   *  qui n'a pas bougé, et donc à ne pas la dégrader par conversion. */
  original: Race | null
  onClose: () => void
  onSave: (race: Race) => void
  onDelete: () => void
}) {
  const { t } = useI18n()
  const format = useFormat()
  const { settings } = useStore()
  const unit = settings.unit

  const [draft, setDraft] = useState<RaceDraft>(initial)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [askDelete, setAskDelete] = useState(false)

  const shown: ValidationErrors = submitted ? errors : {}

  const update = (patch: Partial<RaceDraft>): void => {
    setDraft((current) => {
      const next = { ...current, ...patch }
      if (submitted) setErrors(validateDraft(next))
      return next
    })
  }

  /** Les distances officielles, écrites dans l'unité affichée. */
  const standardDrafts = useMemo(
    () =>
      RACE_TYPES.map((type) => STANDARD_DISTANCE[type])
        .filter((km): km is number => km !== null)
        .map((km) => distanceToDraft(km, unit)),
    [unit],
  )

  const onTypeChange = (value: string): void => {
    const type = value as RaceType
    const standard = STANDARD_DISTANCE[type]
    const untouched =
      draft.distance === '' || standardDrafts.includes(draft.distance)
    update({
      type,
      ...(standard !== null && untouched
        ? { distance: distanceToDraft(standard, unit) }
        : {}),
    })
  }

  const submit = (): void => {
    const found = validateDraft(draft)
    setErrors(found)
    setSubmitted(true)
    if (Object.keys(found).length > 0) return

    const distanceUnchanged =
      original !== null && draft.distance === initial.distance
    const elevationUnchanged =
      original !== null && draft.elevationGain === initial.elevationGain

    onSave({
      id: draft.id,
      type: draft.type as RaceType,
      name: draft.name.trim(),
      date: draft.date,
      distance: distanceUnchanged
        ? original.distance
        : round1(draftToKm(draft.distance, unit) * 100) / 100,
      duration: draft.duration.trim(),
      elevationGain: elevationUnchanged
        ? original.elevationGain
        : draftToMetres(draft.elevationGain, unit),
      location: draft.location.trim(),
      notes: draft.notes,
    })
  }

  const standard = STANDARD_DISTANCE[draft.type as RaceType] ?? null
  const distanceHint =
    standard !== null
      ? t('app.edit.distHintStandard', { distance: format.distance(standard) })
      : t('app.edit.distHintFree')

  const error = (field: keyof ValidationErrors): string | undefined => {
    const key = shown[field]
    return key ? t(key as MessageKey) : undefined
  }

  return (
    <Sheet
      label={isNew ? t('app.edit.newTitle') : t('app.edit.editTitle')}
      onClose={onClose}
    >
      <div className="sheet__head">
        <span className="t-body">
          {isNew ? t('app.edit.newTitle') : t('app.edit.editTitle')}
        </span>
        <Button variant="quiet" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>

      <TextField
        label={t('app.edit.name')}
        value={draft.name}
        onValueChange={(name) => update({ name })}
        placeholder={t('app.edit.namePlaceholder')}
        error={error('name')}
      />

      <div className="form-grid">
        <SelectField
          label={t('app.edit.type')}
          value={draft.type}
          onValueChange={onTypeChange}
          options={RACE_TYPES.map((type) => ({
            value: type,
            label: t(`app.type.${type}` as MessageKey),
          }))}
        />
        <TextField
          label={t('app.edit.date')}
          type="date"
          value={draft.date}
          onValueChange={(date) => update({ date })}
          error={error('date')}
        />
      </div>

      <div className="form-grid">
        <TextField
          label={t('app.edit.distance', { unit: format.distanceUnit })}
          inputMode="decimal"
          value={draft.distance}
          onValueChange={(distance) => update({ distance })}
          hint={distanceHint}
          error={error('distance')}
        />
        <TextField
          label={t('app.edit.duration')}
          inputMode="numeric"
          value={draft.duration}
          onValueChange={(duration) => update({ duration })}
          placeholder={t('app.edit.durationPlaceholder')}
          hint={t('app.edit.durationHint')}
          error={error('duration')}
        />
      </div>

      <div className="form-grid">
        <TextField
          label={t('app.edit.elevation', { unit: format.elevationUnit })}
          inputMode="numeric"
          value={draft.elevationGain}
          onValueChange={(elevationGain) => update({ elevationGain })}
        />
        <TextField
          label={t('app.edit.location')}
          value={draft.location}
          onValueChange={(location) => update({ location })}
        />
      </div>

      <TextAreaField
        label={t('app.edit.notes')}
        value={draft.notes}
        onValueChange={(notes) => update({ notes })}
        placeholder={t('app.edit.notesPlaceholder')}
      />

      {askDelete ? (
        <Confirm
          boxed
          title={t('app.delete.title', { name: draft.name })}
          body={t('app.delete.body')}
        >
          <Button variant="quiet" onClick={() => setAskDelete(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" strong onClick={onDelete}>
            {t('app.delete.confirm')}
          </Button>
        </Confirm>
      ) : (
        <div className="sheet__actions">
          {isNew ? null : (
            <Button variant="destructive" onClick={() => setAskDelete(true)}>
              {t('app.detail.delete')}
            </Button>
          )}
          <div className="sheet__actions-group">
            <Button variant="quiet" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" onClick={submit}>
              {isNew ? t('app.edit.saveNew') : t('app.edit.save')}
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
