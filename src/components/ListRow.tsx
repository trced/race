/** ListRow + Dot — famille « . » 03.4 et 03.5
 *  Une clé, un marqueur, un contenu. Le composant le plus utilisé. */

import type { ReactNode } from 'react'

export interface MarkerProps {
  /** Le point : un événement a eu lieu ce jour-là. */
  dot?: boolean
  /** La veille faisait déjà partie de la course. */
  lineUp?: boolean
  /** Le lendemain en fait encore partie. */
  lineDown?: boolean
}

export function Marker({
  dot = false,
  lineUp = false,
  lineDown = false,
}: MarkerProps) {
  return (
    <span className="marker" aria-hidden="true">
      {lineUp && lineDown ? (
        <span className="marker__line-through" />
      ) : (
        <>
          {lineUp ? <span className="marker__line-up" /> : null}
          {lineDown ? <span className="marker__line-down" /> : null}
        </>
      )}
      {dot ? <span className="marker__dot" /> : null}
    </span>
  )
}

export interface ListRowProps {
  /** Colonne de clé — omise pour une liste sans dates alignées. */
  rowKey?: string | undefined
  marker?: MarkerProps | undefined
  title: ReactNode
  meta?: ReactNode | undefined
  extra?: ReactNode | undefined
  /** Absent : la ligne se lit mais ne s'ouvre pas. */
  onClick?: (() => void) | undefined
  selected?: boolean
  ariaLabel?: string | undefined
  /** Titre en text-body plutôt qu'en text-data — nom d'une course. */
  emphasis?: boolean
}

export function ListRow({
  rowKey,
  marker,
  title,
  meta,
  extra,
  onClick,
  selected = false,
  ariaLabel,
  emphasis = false,
}: ListRowProps) {
  const classes = [
    'row',
    rowKey === undefined ? 'row--nokey' : '',
    selected ? 'row--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      {rowKey === undefined ? null : <span className="row__key">{rowKey}</span>}
      <Marker {...(marker ?? {})} />
      <span className="row__body">
        <span className={`row__title${emphasis ? ' row__title--body' : ''}`}>
          {title}
        </span>
        {meta ? <span className="row__meta">{meta}</span> : null}
        {extra}
      </span>
    </>
  )

  if (!onClick) {
    return <div className={classes}>{body}</div>
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {body}
    </button>
  )
}

/** Creux replié : « 12 jours sans course ». */
export function GapRow({ label }: { label: string }) {
  return (
    <div className="row__gap">
      <span aria-hidden="true">—</span>
      <span />
      <span>{label}</span>
    </div>
  )
}
