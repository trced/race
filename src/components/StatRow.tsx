/** StatRow — famille « . » 03.8
 *  Une valeur remarquable et ce qui la qualifie. Le composant ne dessine
 *  rien : ici le chiffre est le graphique. */

import type { ReactNode } from 'react'

export interface StatRowProps {
  label: string
  value: string
  /** Catégorie sans donnée : « — », jamais masquée. */
  empty?: boolean
  /** Deux lignes de contexte au maximum. */
  context?: string
  aside?: string
  note?: string
  onClick?: () => void
}

export function StatRow({
  label,
  value,
  empty = false,
  context,
  aside,
  note,
  onClick,
}: StatRowProps) {
  const body = (
    <>
      <span className="stat__line">
        <span className="stat__label">{label}</span>
        <span className={`stat__value${empty ? ' stat__value--empty' : ''}`}>
          {value}
        </span>
      </span>
      {context || aside ? (
        <span className="stat__line">
          <span className="stat__context">{context}</span>
          <span className="stat__context t-nowrap">{aside}</span>
        </span>
      ) : null}
      {note ? <span className="stat__context">{note}</span> : null}
    </>
  )

  if (!onClick) return <div className="stat">{body}</div>
  return (
    <button type="button" className="stat" onClick={onClick}>
      {body}
    </button>
  )
}

/** Ligne de synthèse : un libellé, une valeur, rien d'autre. */
export function SummaryRow({
  label,
  value,
}: {
  label: string
  value: ReactNode
}) {
  return (
    <div className="stat stat--ruled">
      <span className="stat__line">
        <span className="stat__label">{label}</span>
        <span className="t-label">{value}</span>
      </span>
    </div>
  )
}
