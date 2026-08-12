/** Sheet — famille « . » 03.9
 *  Surface temporaire pour créer, éditer ou régler. Trait 1 px, pas d'ombre.
 *  Focus déplacé sur le premier élément, piégé, restitué à la fermeture. */

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function focusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

export interface SheetProps {
  label: string
  onClose: () => void
  /** Panneau plein cadre plutôt que feuille par le bas. */
  full?: boolean
  children: ReactNode
}

export function Sheet({ label, onClose, full = false, children }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<Element | null>(null)

  useEffect(() => {
    opener.current = document.activeElement
    const first = panel.current ? focusable(panel.current)[0] : null
    first?.focus()

    return () => {
      const el = opener.current
      if (el instanceof HTMLElement && document.contains(el)) el.focus()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel.current) return
      const items = focusable(panel.current)
      if (items.length === 0) return
      const first = items[0]!
      const last = items[items.length - 1]!
      const active = document.activeElement
      if (event.shiftKey && (active === first || !panel.current.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [onClose])

  if (full) {
    return (
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="sheet sheet--full"
      >
        {children}
      </div>
    )
  }

  return (
    <div className="sheet-scrim">
      <button
        type="button"
        className="sheet-scrim__dismiss"
        aria-label={label}
        tabIndex={-1}
        onClick={onClose}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="sheet"
      >
        {children}
      </div>
    </div>
  )
}
