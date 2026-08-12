/** Sheet — famille « . » 03.9
 *  Surface temporaire pour créer, éditer ou régler. Trait 1 px, pas d'ombre.
 *  Focus déplacé sur le premier élément, piégé, restitué à la fermeture.
 *  La feuille par le bas se glisse vers le bas pour se fermer ; le bouton
 *  « fermer » et la touche Échap restent, eux, les chemins garantis. */

import { useEffect, useRef, useState } from 'react'
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
  TransitionEvent as ReactTransitionEvent,
} from 'react'

/** Au-delà de cette distance — ou plus bas à ce rythme — le geste ferme. */
const DISMISS_DISTANCE = 96
const DISMISS_RATIO = 0.3
const DISMISS_VELOCITY = 0.5
const FLICK_MIN = 24

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
      <DraggableSheet panelRef={panel} label={label} onClose={onClose}>
        {children}
      </DraggableSheet>
    </div>
  )
}

type Phase = 'idle' | 'dragging' | 'settling'

interface Gesture {
  active: boolean
  startY: number
  lastY: number
  lastT: number
  velocity: number
}

const NO_GESTURE: Gesture = {
  active: false,
  startY: 0,
  lastY: 0,
  lastT: 0,
  velocity: 0,
}

function DraggableSheet({
  panelRef,
  label,
  onClose,
  children,
}: {
  panelRef: RefObject<HTMLDivElement | null>
  label: string
  onClose: () => void
  children: ReactNode
}) {
  const gesture = useRef<Gesture>(NO_GESTURE)
  const [offset, setOffset] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    gesture.current = {
      active: true,
      startY: event.clientY,
      lastY: event.clientY,
      lastT: event.timeStamp,
      velocity: 0,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setPhase('dragging')
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const state = gesture.current
    if (!state.active) return
    const elapsed = event.timeStamp - state.lastT
    if (elapsed > 0) {
      state.velocity = (event.clientY - state.lastY) / elapsed
    }
    state.lastY = event.clientY
    state.lastT = event.timeStamp
    // Vers le haut, la feuille ne bouge pas : elle est déjà au plafond.
    setOffset(Math.max(0, event.clientY - state.startY))
  }

  const endGesture = (
    event: ReactPointerEvent<HTMLDivElement>,
    dismissible: boolean,
  ): void => {
    const state = gesture.current
    if (!state.active) return
    gesture.current = NO_GESTURE
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const travelled = Math.max(0, event.clientY - state.startY)
    const height = panelRef.current?.offsetHeight ?? 0
    const farEnough =
      travelled > Math.min(DISMISS_DISTANCE, height * DISMISS_RATIO)
    const flicked = travelled > FLICK_MIN && state.velocity > DISMISS_VELOCITY

    if (dismissible && (farEnough || flicked)) {
      onClose()
      return
    }
    setPhase('settling')
    setOffset(0)
  }

  /** Les boutons de la feuille ont aussi des transitions : seule celle de la
   *  feuille elle-même termine le geste. */
  const onSettled = (event: ReactTransitionEvent<HTMLDivElement>): void => {
    if (event.target !== event.currentTarget) return
    if (event.propertyName !== 'transform') return
    setPhase('idle')
  }

  const classes = [
    'sheet',
    phase === 'dragging' ? 'sheet--dragging' : '',
    phase === 'settling' ? 'sheet--settling' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={classes}
      {...(offset > 0 ? { style: { transform: `translateY(${offset}px)` } } : {})}
      onTransitionEnd={onSettled}
    >
      <div
        className="sheet__grab"
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endGesture(event, true)}
        onPointerCancel={(event) => endGesture(event, false)}
      />
      {children}
    </div>
  )
}
