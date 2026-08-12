/** Vue Records — meilleur temps par distance, extrêmes, totaux.
 *  Tri fixe : ce qui n'est pas comparable ne se compare pas. */

import { useI18n } from '../../i18n/index.tsx'
import { StatRow, SummaryRow } from '../../components/StatRow.tsx'
import { formatDuration, secondsToDuration } from '../../lib/format.ts'
import { computeRecords, computeTotals } from '../../lib/records.ts'
import type { MessageKey } from '../../i18n/index.tsx'
import type { Race } from '../../lib/types.ts'
import { useFormat } from '../useFormat.ts'

export function RecordsView({
  races,
  onOpen,
}: {
  races: Race[]
  onOpen: (race: Race) => void
}) {
  const { t, tp } = useI18n()
  const format = useFormat()
  const records = computeRecords(races)
  const totals = computeTotals(races)

  return (
    <div className="records">
      <ul className="list">
        {records.map(({ category, best, count, gapSeconds }) => (
          <li key={category.key} className="list__item">
            {best ? (
              <StatRow
                label={t(category.key as MessageKey)}
                value={formatDuration(best.duration)}
                context={[best.name, format.date(best.date)]
                  .filter(Boolean)
                  .join(' · ')}
                aside={format.pace(best)}
                note={[
                  tp('app.records.count', count),
                  gapSeconds !== null
                    ? t('app.records.gap', {
                        gap: formatDuration(secondsToDuration(gapSeconds)),
                      })
                    : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
                onClick={() => onOpen(best)}
              />
            ) : (
              <StatRow
                label={t(category.key as MessageKey)}
                value={t('app.records.empty')}
                empty
                context={t('app.records.none')}
              />
            )}
          </li>
        ))}
      </ul>

      <div className="records__section">
        <div className="section-label">{t('app.records.outOfFormat')}</div>
        <SummaryRow
          label={t('app.records.longest')}
          value={
            totals.longest
              ? `${totals.longest.name} — ${format.distance(totals.longest.distance)}`
              : t('app.records.empty')
          }
        />
        <SummaryRow
          label={t('app.records.steepest')}
          value={
            totals.steepest?.elevationGain
              ? `${totals.steepest.name} — D+ ${format.elevation(totals.steepest.elevationGain)}`
              : t('app.records.empty')
          }
        />
      </div>

      <div className="records__section">
        <div className="section-label">{t('app.records.total')}</div>
        <SummaryRow
          label={t('app.records.totalRaces')}
          value={String(totals.races)}
        />
        <SummaryRow
          label={t('app.records.totalDistance')}
          value={format.distance(totals.km)}
        />
        <SummaryRow
          label={t('app.records.totalElevation')}
          value={format.elevation(totals.elevation)}
        />
      </div>
    </div>
  )
}
