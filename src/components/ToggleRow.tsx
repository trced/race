/** Toggle — famille « . » 03.3
 *  Un mot d'état qui défile au clic, pas un interrupteur graphique.
 *  <button> simple : ni role="switch", ni radiogroup. */

import type { ReactNode } from 'react'
import { Link } from 'react-router'

export interface ToggleRowProps {
  name: string
  value: string
  /** Nom accessible complet : « thème : système, changer ». */
  ariaLabel: string
  onCycle: () => void
  danger?: boolean
}

export function ToggleRow({
  name,
  value,
  ariaLabel,
  onCycle,
  danger = false,
}: ToggleRowProps) {
  return (
    <button
      type="button"
      className={`toggle-row${danger ? ' toggle-row--danger' : ''}`}
      aria-label={ariaLabel}
      onClick={onCycle}
    >
      <span className="toggle-row__name">{name}</span>
      <span className="toggle-row__value">{value}</span>
    </button>
  )
}

/** Même ligne, mais qui déclenche une action plutôt qu'un cycle. */
export function ActionRow({
  name,
  value,
  onClick,
  danger = false,
  ariaLabel,
}: {
  name: string
  value: ReactNode
  onClick: () => void
  danger?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      className={`toggle-row${danger ? ' toggle-row--danger' : ''}`}
      onClick={onClick}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      <span className="toggle-row__name">{name}</span>
      <span className="toggle-row__value">{value}</span>
    </button>
  )
}

/** Même ligne, en lien de navigation. */
export function LinkRow({
  name,
  value,
  to,
  external = false,
}: {
  name: string
  value: ReactNode
  to: string
  external?: boolean
}) {
  if (external) {
    return (
      <a
        className="toggle-row"
        href={to}
        rel="noreferrer noopener"
        target="_blank"
      >
        <span className="toggle-row__name">{name}</span>
        <span className="toggle-row__value">{value}</span>
      </a>
    )
  }
  return (
    <Link className="toggle-row" to={to}>
      <span className="toggle-row__name">{name}</span>
      <span className="toggle-row__value">{value}</span>
    </Link>
  )
}

/** Ligne sans action : une valeur qu'on lit, pas qu'on change. */
export function StaticRow({ name, value }: { name: string; value: ReactNode }) {
  return (
    <div className="toggle-row toggle-row--static">
      <span className="toggle-row__name">{name}</span>
      <span className="toggle-row__value">{value}</span>
    </div>
  )
}
