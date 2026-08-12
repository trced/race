/** Fiche d'une course : ce qu'on consulte avant de décider de la modifier. */

import { useState } from 'react'
import { Button } from '../../components/Button.tsx'
import { Confirm } from '../../components/Feedback.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { useI18n } from '../../i18n/index.tsx'
import type { Race } from '../../lib/types.ts'
import { useFormat } from '../useFormat.ts'

export function RaceDetailSheet({
  race,
  onClose,
  onEdit,
  onDelete,
}: {
  race: Race
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useI18n()
  const format = useFormat()
  const [askDelete, setAskDelete] = useState(false)

  const place = [race.location, format.typeLabel(race)]
    .filter(Boolean)
    .join(' · ')

  return (
    <Sheet label={t('app.detail.label')} onClose={onClose}>
      <div className="sheet__head">
        <span className="t-brand">{race.name}</span>
        <Button variant="quiet" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>

      <div className="detail__headline">
        <span className="detail__time">{format.duration(race.duration)}</span>
        <span className="t-label t-dim">{format.pace(race)}</span>
      </div>

      <dl className="detail__list">
        <div className="detail__pair">
          <dt className="t-label t-dim">{t('app.detail.distance')}</dt>
          <dd className="t-data">{format.distance(race.distance)}</dd>
        </div>
        <div className="detail__pair">
          <dt className="t-label t-dim">{t('app.detail.elevation')}</dt>
          <dd className="t-data">
            {race.elevationGain
              ? format.elevation(race.elevationGain)
              : t('app.detail.none')}
          </dd>
        </div>
        <div className="detail__pair">
          <dt className="t-label t-dim">{t('app.detail.date')}</dt>
          <dd className="t-data">{format.date(race.date)}</dd>
        </div>
        <div className="detail__pair">
          <dt className="t-label t-dim">
            {race.location ? t('app.detail.place') : t('app.detail.placeType')}
          </dt>
          <dd className="t-data">{place}</dd>
        </div>
      </dl>

      <div>
        <div className="t-meta t-muted">{t('app.detail.notes')}</div>
        {race.notes ? (
          <p className="detail__notes">{race.notes}</p>
        ) : (
          <p className="detail__notes t-muted">{t('app.detail.noNotes')}</p>
        )}
      </div>

      {askDelete ? (
        <Confirm
          boxed
          title={t('app.delete.title', { name: race.name })}
          body={t('app.delete.body')}
        >
          <Button variant="quiet" onClick={() => setAskDelete(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" strong onClick={onDelete}>
            {t('app.delete.confirm')}
          </Button>
        </Confirm>
      ) : (
        <div className="sheet__actions">
          <Button variant="destructive" onClick={() => setAskDelete(true)}>
            {t('app.detail.delete')}
          </Button>
          <Button variant="primary" onClick={onEdit}>
            {t('app.detail.edit')}
          </Button>
        </div>
      )}
    </Sheet>
  )
}
