import { describe, expect, it } from 'vitest'
import { parseDistance, validateDraft } from './validate.ts'
import type { RaceDraft } from './validate.ts'

const draft = (patch: Partial<RaceDraft> = {}): RaceDraft => ({
  id: 'new',
  type: '10k',
  name: '10k de Lyon',
  date: '2026-08-02',
  distance: '10',
  duration: '45:00',
  elevationGain: '',
  location: '',
  notes: '',
  ...patch,
})

describe('validateDraft', () => {
  it('accepte une course complète', () => {
    expect(validateDraft(draft())).toEqual({})
  })

  it('exige un nom non vide', () => {
    expect(validateDraft(draft({ name: '   ' })).name).toBe(
      'app.edit.error.name',
    )
  })

  it('distingue le format de date de la date impossible', () => {
    expect(validateDraft(draft({ date: '02/08/2026' })).date).toBe(
      'app.edit.error.dateFormat',
    )
    expect(validateDraft(draft({ date: '2026-02-31' })).date).toBe(
      'app.edit.error.dateUnreal',
    )
  })

  it('refuse une distance nulle ou négative', () => {
    expect(validateDraft(draft({ distance: '0' })).distance).toBeTruthy()
    expect(validateDraft(draft({ distance: '-5' })).distance).toBeTruthy()
    expect(validateDraft(draft({ distance: 'dix' })).distance).toBeTruthy()
  })

  it('accepte la virgule décimale', () => {
    expect(validateDraft(draft({ distance: '21,1' })).distance).toBeUndefined()
    expect(parseDistance('21,1')).toBeCloseTo(21.1)
  })

  it('n’accepte que h:mm:ss ou mm:ss', () => {
    expect(validateDraft(draft({ duration: '45:00' })).duration).toBeUndefined()
    expect(
      validateDraft(draft({ duration: '46:30:00' })).duration,
    ).toBeUndefined()
    expect(validateDraft(draft({ duration: '45' })).duration).toBeTruthy()
    expect(validateDraft(draft({ duration: '3:75' })).duration).toBeTruthy()
    expect(validateDraft(draft({ duration: '' })).duration).toBeTruthy()
  })

  it('signale tous les champs fautifs d’un coup', () => {
    const errors = validateDraft(
      draft({ name: '', date: 'hier', distance: '', duration: '' }),
    )
    expect(Object.keys(errors).sort()).toEqual([
      'date',
      'distance',
      'duration',
      'name',
    ])
  })
})
