/** Fiche d'une course : ce qu'on consulte avant de décider de la modifier.
 *  Le contenu ne connaît pas sa surface — feuille par le bas sur téléphone,
 *  volet de droite sur grand écran. */

import { useState } from 'react'
import { Button } from '../../components/Button.tsx'
import { Confirm } from '../../components/Feedback.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { useI18n } from '../../i18n/index.tsx'
import type { Race } from '../../lib/types.ts'
import { useFormat } from '../useFormat.ts'

export interface RaceDetailProps {
  race: Race
  onEdit: () => void
  onDelete: () => void
  /** Absent : la fiche occupe sa colonne et ne se referme pas — il n'y a
   *  rien derrière elle à révéler. */
  onClose?: (() => void) | undefined
}

export function RaceDetailSheet(
  props: RaceDetailProps & { onClose: () => void },
) {
  const { t } = useI18n()
  return (
    <Sheet label={t('app.detail.label')} onClose={props.onClose}>
      <RaceDetail {...props} />
    </Sheet>
  )
}

export function RaceDetail({
  race,
  onClose,
  onEdit,
  onDelete,
}: RaceDetailProps) {
  const { t } = useI18n()
  const format = useFormat()
  const [askDelete, setAskDelete] = useState(false)

  const place = [race.location, format.typeLabel(race)]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <div className="sheet__head">
        <span className="t-brand">{race.name}</span>
        {onClose ? (
          <Button variant="quiet" onClick={onClose}>
            {t('common.close')}
          </Button>
        ) : null}
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
    </>
  )
}
