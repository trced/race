/** Vue Année — douze cases, une année en un coup d'œil.
 *  ● N = N courses dans le mois · · = aucune. */

import { useI18n } from '../../i18n/index.tsx'
import { countByMonth } from '../../lib/calendar.ts'
import { monthName, monthNameShort } from '../../lib/format.ts'
import type { Race } from '../../lib/types.ts'

export function YearView({
  races,
  year,
  onOpenMonth,
}: {
  races: Race[]
  year: number
  onOpenMonth: (month: number) => void
}) {
  const { t, tp, locale, n } = useI18n()
  const counts = countByMonth(races, year)

  return (
    <>
      <div className="year-grid">
        {counts.map((count, index) => (
          <button
            key={index}
            type="button"
            className="year-cell"
            aria-label={
              count === 0
                ? t('app.year.monthAria.none', {
                    month: monthName(index, locale),
                  })
                : tp('app.year.monthAria', count, {
                    month: monthName(index, locale),
                  })
            }
            onClick={() => onOpenMonth(index)}
          >
            <span className="year-cell__name" aria-hidden="true">
              {monthNameShort(index, locale)}
            </span>
            <span className="year-cell__marker" aria-hidden="true">
              {count > 0 ? `● ${n(count)}` : t('app.year.marker.none')}
            </span>
          </button>
        ))}
      </div>
      <p className="year-legend">{t('app.year.legend')}</p>
    </>
  )
}
