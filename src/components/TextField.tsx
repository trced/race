/** TextField — famille « . » 03.2
 *  Le label est toujours visible ; le placeholder ne le remplace jamais.
 *  L'erreur remplace l'aide et est annoncée en role="alert". */

import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  hint?: string | undefined
  /** Message complet, jamais un code. */
  error?: string | undefined
  /** Masque visuellement le label — il reste lu. */
  hideLabel?: boolean
  /** Marque le champ d'un astérisque et le déclare à l'assistance.
   *  La validation, elle, reste celle du formulaire. */
  required?: boolean | undefined
}

/** L'astérisque est hors du <label> : le nom accessible du champ reste le
 *  libellé seul, et c'est aria-required qui porte l'obligation. */
function FieldLabel({
  id,
  hidden,
  required,
  children,
}: {
  id: string
  hidden: boolean
  required: boolean
  children: ReactNode
}) {
  const label = (
    <label className={hidden ? 'visually-hidden' : 'field__label'} htmlFor={id}>
      {children}
    </label>
  )

  if (hidden || !required) return label

  return (
    <span className="field__labelrow">
      {label}
      <span className="field__required" aria-hidden="true">
        *
      </span>
    </span>
  )
}

export interface TextFieldProps
  extends BaseProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'value' | 'onChange' | 'className' | 'id'
    > {
  /** Bouton × dessiné, jamais le rendu natif. */
  clearable?: boolean
  onClear?: () => void
  clearLabel?: string
}

export function TextField({
  label,
  value,
  onValueChange,
  hint,
  error,
  hideLabel = false,
  required = false,
  clearable = false,
  onClear,
  clearLabel = '×',
  type = 'text',
  ...rest
}: TextFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const showClear = clearable && value !== ''

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <FieldLabel id={id} hidden={hideLabel} required={required}>
        {label}
      </FieldLabel>
      <div className="field__wrap">
        <input
          id={id}
          type={type}
          className={`field__input${showClear ? ' field__input--clearable' : ''}`}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...rest}
        />
        {showClear ? (
          <button
            type="button"
            className="field__clear"
            aria-label={clearLabel}
            onClick={() => {
              onClear?.()
              document.getElementById(id)?.focus()
            }}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
      {error ? (
        <span id={errorId} role="alert" className="field__error">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  )
}

export interface TextAreaFieldProps
  extends BaseProps,
    Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      'value' | 'onChange' | 'className' | 'id'
    > {}

export function TextAreaField({
  label,
  value,
  onValueChange,
  hint,
  error,
  hideLabel = false,
  required = false,
  rows = 3,
  ...rest
}: TextAreaFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <FieldLabel id={id} hidden={hideLabel} required={required}>
        {label}
      </FieldLabel>
      <div className="field__wrap">
        <textarea
          id={id}
          className="field__input"
          rows={rows}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...rest}
        />
      </div>
      {error ? (
        <span id={errorId} role="alert" className="field__error">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      ) : null}
    </div>
  )
}

export interface SelectFieldProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  /** Sans conteneur ni label visible — pour une rangée déjà composée. */
  bare?: boolean
  /** Classe du <select> — la barre de recherche a la sienne. */
  selectClassName?: string
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  bare = false,
  selectClassName = 'field__input',
}: SelectFieldProps) {
  const id = useId()
  const select = (
    <select
      id={id}
      className={selectClassName}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  if (bare) {
    return (
      <>
        <label className="visually-hidden" htmlFor={id}>
          {label}
        </label>
        {select}
      </>
    )
  }

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__wrap">{select}</div>
    </div>
  )
}
