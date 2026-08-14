/** L'erreur d'un champ, et surtout qu'elle se voie et s'entende : le message
 *  remplace l'aide, le champ se déclare invalide, et l'annonce part en alerte.
 *
 *  `TextAreaField` ne faisait rien de tout cela — il se contentait de rougir
 *  son trait. Ces tests sont là pour que la dissymétrie ne revienne pas. */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextAreaField, TextField } from './TextField.tsx'

const HINT = '600 caractères au maximum'
const ERROR = 'La note dépasse 200 caractères.'

const noop = () => {}

describe('TextField', () => {
  it("annonce l'erreur, et elle remplace l'aide", () => {
    render(
      <TextField
        label="Nom"
        value="trop long"
        onValueChange={noop}
        hint={HINT}
        error={ERROR}
      />,
    )

    const control = screen.getByLabelText('Nom')
    const alert = screen.getByRole('alert')

    expect(control.getAttribute('aria-invalid')).toBe('true')
    expect(alert.textContent).toBe(ERROR)
    expect(control.getAttribute('aria-describedby')).toBe(alert.id)
    expect(screen.queryByText(HINT)).toBeNull()
  })

  it("décrit le champ par son aide quand il n'y a pas d'erreur", () => {
    render(<TextField label="Nom" value="" onValueChange={noop} hint={HINT} />)

    const control = screen.getByLabelText('Nom')

    expect(control.getAttribute('aria-invalid')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(control.getAttribute('aria-describedby')).toBe(
      screen.getByText(HINT).id,
    )
  })
})

describe('TextAreaField', () => {
  it("annonce l'erreur, et elle remplace l'aide", () => {
    render(
      <TextAreaField
        label="Notes"
        value="trop long"
        onValueChange={noop}
        hint={HINT}
        error={ERROR}
      />,
    )

    const control = screen.getByLabelText('Notes')
    const alert = screen.getByRole('alert')

    expect(control.getAttribute('aria-invalid')).toBe('true')
    expect(alert.textContent).toBe(ERROR)
    expect(control.getAttribute('aria-describedby')).toBe(alert.id)
    expect(screen.queryByText(HINT)).toBeNull()
  })

  it("décrit le champ par son aide quand il n'y a pas d'erreur", () => {
    render(
      <TextAreaField label="Notes" value="" onValueChange={noop} hint={HINT} />,
    )

    const control = screen.getByLabelText('Notes')

    expect(control.getAttribute('aria-invalid')).toBeNull()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(control.getAttribute('aria-describedby')).toBe(
      screen.getByText(HINT).id,
    )
  })
})
