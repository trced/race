/** EmptyState / Message — famille « . » 03.10
 *  EmptyState : constat · invitation · action. Trois lignes, aucune illustration.
 *  Message : ce qui s'est passé · pourquoi · quoi faire. Jamais de code technique. */

import type { ReactNode } from 'react'

export function EmptyState({
  title,
  body,
  action,
  note,
}: {
  title: string
  body: string
  action?: ReactNode
  note?: string
}) {
  return (
    <div className="feedback">
      <p className="feedback__title">{title}</p>
      <p className="feedback__body">{body}</p>
      {action ? <div className="feedback__action">{action}</div> : null}
      {note ? <p className="feedback__note">{note}</p> : null}
    </div>
  )
}

export function Message({
  title,
  body,
  action,
  tone = 'error',
}: {
  title: string
  body: string
  action?: ReactNode
  tone?: 'error' | 'neutral'
}) {
  return (
    <div className="feedback" {...(tone === 'error' ? { role: 'alert' } : {})}>
      <p className={`feedback__title${tone === 'error' ? ' t-danger' : ''}`}>
        {title}
      </p>
      <p className="feedback__body">{body}</p>
      {action ? <div className="feedback__action">{action}</div> : null}
    </div>
  )
}

/** Confirmation en ligne — jamais de window.confirm. */
export function Confirm({
  title,
  body,
  children,
  boxed = false,
}: {
  title: string
  body: string
  children: ReactNode
  boxed?: boolean
}) {
  return (
    <div className={`confirm${boxed ? ' confirm--boxed' : ''}`}>
      <p className="confirm__title t-danger">{title}</p>
      <p className="confirm__body">{body}</p>
      <div className="confirm__actions">{children}</div>
    </div>
  )
}
