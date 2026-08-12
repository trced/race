/** Vue Mois — le détail, jour par jour.
 *  Une course de plusieurs jours s'affiche au départ, prolongée par un trait ;
 *  trois jours vides ou plus se replient en une seule ligne. */

import { useI18n } from '../../i18n/index.tsx'
import { GapRow, ListRow } from '../../components/ListRow.tsx'
import { buildMonth } from '../../lib/calendar.ts'
import { dayKey } from '../../lib/format.ts'
import type { Race } from '../../lib/types.ts'
import { useFormat } from '../useFormat.ts'

export function MonthView({
  races,
  year,
  month,
  onOpen,
}: {
  races: Race[]
  year: number
  month: number
  onOpen: (race: Race) => void
}) {
  const { t, tp, locale } = useI18n()
  const format = useFormat()
  const entries = buildMonth(races, year, month)

  return (
    <ul className="list app__pad">
      {entries.map((entry, index) => {
        if (entry.kind === 'gap') {
          return (
            <li key={`gap-${index}`} className="list__item">
              <GapRow label={tp('app.month.gap', entry.days)} />
            </li>
          )
        }

        const race = entry.race ?? entry.continuation
        const title = entry.race
          ? entry.race.name
          : entry.continuation
            ? t('app.month.continued', { name: entry.continuation.name })
            : t('app.month.none')

        return (
          <li key={entry.iso} className="list__item">
            <ListRow
              rowKey={dayKey(entry.date, locale)}
              marker={{
                dot: Boolean(entry.race),
                lineUp: entry.lineUp,
                lineDown: entry.lineDown,
              }}
              title={title}
              meta={entry.race ? format.meta(entry.race) : undefined}
              onClick={race ? () => onOpen(race) : undefined}
            />
          </li>
        )
      })}
    </ul>
  )
}
