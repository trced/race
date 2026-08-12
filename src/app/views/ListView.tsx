/** Vue Liste — la vue par défaut. Toutes les années, une course par ligne. */

import { useI18n } from '../../i18n/index.tsx'
import { ListRow } from '../../components/ListRow.tsx'
import type { Race } from '../../lib/types.ts'
import { useFormat } from '../useFormat.ts'

export function ListView({
  races,
  showYears,
  selectedId,
  onOpen,
}: {
  races: Race[]
  /** Le rappel d'année n'a de sens que sur un tri chronologique. */
  showYears: boolean
  /** La course ouverte dans le volet de droite, quand il y en a un. */
  selectedId?: string | undefined
  onOpen: (race: Race) => void
}) {
  const { t } = useI18n()
  const format = useFormat()
  let lastYear: string | null = null

  return (
    <ul className="list app__pad">
      {races.map((race) => {
        const year = race.date.slice(0, 4)
        const newYear = showYears && year !== lastYear
        lastYear = year
        const sub = [format.date(race.date), race.location]
          .filter(Boolean)
          .join(' · ')

        return (
          <li key={race.id} className="list__item">
            {newYear ? <div className="list__year">{year}</div> : null}
            <ListRow
              marker={{ dot: true }}
              title={race.name}
              emphasis
              selected={race.id === selectedId}
              onClick={() => onOpen(race)}
              extra={
                <>
                  <span className="row__line">{format.meta(race, true)}</span>
                  <span className="row__meta">{sub}</span>
                  {race.notes ? (
                    <span className="row__meta">
                      {t('app.list.notes', { notes: race.notes })}
                    </span>
                  ) : null}
                </>
              }
            />
          </li>
        )
      })}
    </ul>
  )
}
