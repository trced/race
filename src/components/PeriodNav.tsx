/** PeriodNav — famille « . » 03.6
 *  Le titre EST le retour à la période courante ; la légende de 12 px
 *  sous le titre ne disparaît jamais — rien à deviner, aucun décalage. */

export interface PeriodNavProps {
  title: string
  /** Libellé de la période précédente, nommé plutôt que « précédent ». */
  prevLabel: string
  nextLabel: string
  prevAria: string
  nextAria: string
  /** « aujourd'hui » sur la période courante, « revenir à… » ailleurs. */
  caption: string
  captionHint: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function PeriodNav({
  title,
  prevLabel,
  nextLabel,
  prevAria,
  nextAria,
  caption,
  captionHint,
  onPrev,
  onNext,
  onToday,
}: PeriodNavProps) {
  return (
    <div className="period-nav">
      <button
        type="button"
        className="period-nav__side"
        aria-label={prevAria}
        onClick={onPrev}
      >
        <span aria-hidden="true">‹&nbsp;</span>
        <span className="period-nav__side-label" aria-hidden="true">
          {prevLabel}
        </span>
      </button>
      <button
        type="button"
        className="period-nav__current"
        title={captionHint}
        onClick={onToday}
      >
        <span className="period-nav__title" aria-live="polite">
          {title}
        </span>
        <span className="period-nav__caption">{caption}</span>
      </button>
      <button
        type="button"
        className="period-nav__side period-nav__side--next"
        aria-label={nextAria}
        onClick={onNext}
      >
        <span className="period-nav__side-label" aria-hidden="true">
          {nextLabel}
        </span>
        <span aria-hidden="true">&nbsp;›</span>
      </button>
    </div>
  )
}
