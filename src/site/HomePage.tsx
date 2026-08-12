/** Page de présentation : la promesse, les faits, les trois concepts,
 *  l'application elle-même, puis une seule action.
 *  Aucune image, aucun dégradé — texte, ligne, point, espace. */

import { Link } from 'react-router'
import { RaceApp } from '../app/RaceApp.tsx'
import { useFormat } from '../app/useFormat.ts'
import { useMediaQuery } from '../app/useMediaQuery.ts'
import { Marker } from '../components/ListRow.tsx'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { buildMonth, countByMonth } from '../lib/calendar.ts'
import { dayKey, monthNameShort } from '../lib/format.ts'
import { SAMPLE_RACES } from '../lib/sample.ts'
import { DemoStoreProvider } from '../state/store.tsx'
import { useDocumentMeta } from './SiteLayout.tsx'

const FACTS: [MessageKey, MessageKey][] = [
  ['site.home.fact.account', 'site.home.fact.accountNote'],
  ['site.home.fact.free', 'site.home.fact.freeNote'],
  ['site.home.fact.offline', 'site.home.fact.offlineNote'],
  ['site.home.fact.device', 'site.home.fact.deviceNote'],
  ['site.home.fact.install', 'site.home.fact.installNote'],
  ['site.home.fact.portable', 'site.home.fact.portableNote'],
]

const CONCEPTS: [MessageKey, MessageKey][] = [
  ['site.home.concept.race', 'site.home.concept.raceBody'],
  ['site.home.concept.views', 'site.home.concept.viewsBody'],
  ['site.home.concept.dot', 'site.home.concept.dotBody'],
]

const HINTS: MessageKey[] = [
  'site.home.appHint.detail',
  'site.home.appHint.year',
  'site.home.appHint.records',
  'site.home.appHint.settings',
]

const REFUSALS: MessageKey[] = [
  'site.home.notdo.gps',
  'site.home.notdo.badges',
  'site.home.notdo.social',
  'site.home.notdo.notifications',
]

/** L'encart mesure 390 × 844 : en dessous de cette largeur, c'est un
 *  téléphone dans un téléphone. Il ne dit rien de plus que les trois aperçus
 *  et il mange un écran entier — on ne le monte pas du tout. */
const SHOW_APP = '(min-width: 900px)'

export function HomePage() {
  useDocumentMeta('site.home.metaTitle', 'site.home.metaDescription')
  const { t } = useI18n()
  const showApp = useMediaQuery(SHOW_APP)

  return (
    <>
      {/* Sur grand écran, les faits passent en rail à droite de la promesse :
          la page occupe sa largeur sans jamais allonger une ligne de texte. */}
      <section className="site__lede site__lede--split">
        <div className="site__lede-text">
          <h1 className="site__h1">{t('site.home.title')}</h1>
          <p className="site__text">{t('site.home.lede')}</p>
          <div className="site__actions">
            <Link className="btn btn--primary" to="/app">
              {t('site.home.cta')}
            </Link>
            <Link className="btn btn--text" to="/app?demo=1">
              {t('site.home.demo')}
            </Link>
          </div>
        </div>
        <ul className="facts">
          {FACTS.map(([name, note]) => (
            <li key={name} className="facts__item">
              <div className="facts__name">{t(name)}</div>
              <div className="facts__note">{t(note)}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="section-label section-label--strong">
          {t('site.home.concepts')}
        </h2>
        <ol>
          {CONCEPTS.map(([name, body], index) => (
            <li key={name} className="numbered__item">
              <span className="numbered__index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="numbered__stack">
                <strong className="numbered__name">{t(name)}</strong>
                <span className="numbered__body">{t(body)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="section-label section-label--strong">
          {t('site.home.app')}
        </h2>
        <div className="showcase">
          {showApp ? (
            <div className="showcase__frame">
              <DemoStoreProvider>
                <RaceApp embedded />
              </DemoStoreProvider>
              <span className="t-meta t-muted">
                {t('site.home.appCaption')}
              </span>
            </div>
          ) : null}
          <div className="showcase__aside">
            <p className="site__text t-data">{t('site.home.appBody')}</p>
            {/* Les repères décrivent des gestes dans le cadre : sans cadre,
                c'est le lien vers l'exemple qui les remplace. */}
            {showApp ? (
              <ul className="showcase__hints">
                {HINTS.map((hint) => (
                  <li key={hint}>{t(hint)}</li>
                ))}
              </ul>
            ) : (
              <Link className="btn btn--text" to="/app?demo=1">
                {t('site.home.demo')}
              </Link>
            )}

            <h3 className="section-label section-label--strong showcase__subhead">
              {t('site.home.views')}
            </h3>
            <div className="previews">
              <ListPreview />
              <YearPreview />
              <MonthPreview />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-label section-label--strong">
          {t('site.home.notdo')}
        </h2>
        <ul className="refusals">
          {REFUSALS.map((item) => (
            <li key={item} className="refusals__item">
              <span className="refusals__dash" aria-hidden="true">
                —
              </span>
              <span>{t(item)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="closing">
        <div className="closing__text">
          <span className="t-body">{t('site.home.ready')}</span>
          <span className="t-meta t-muted">{t('site.home.readyNote')}</span>
        </div>
        <Link className="btn btn--primary" to="/app">
          {t('site.home.start')}
        </Link>
      </section>
    </>
  )
}

/** Les trois aperçus lisent le même jeu d'exemple et les mêmes fonctions de
 *  formatage que l'application : ils ne peuvent pas la contredire. */

const PREVIEW_YEAR = 2026
const PREVIEW_MONTH = 7 // août — le mois qui porte une course de deux jours

function ListPreview() {
  const { t } = useI18n()
  const format = useFormat()
  const rows = SAMPLE_RACES.slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3)

  return (
    <div className="preview">
      <div className="t-label">{t('site.home.view.list')}</div>
      <div className="preview__body" aria-hidden="true">
        {rows.map((race) => (
          <div key={race.id} className="preview__row">
            <span className="preview__dot" />
            <span>
              <span className="preview__strong">{race.name}</span>
              <br />
              {format.distance(race.distance)} –{' '}
              {format.duration(race.duration)}
            </span>
          </div>
        ))}
      </div>
      <p className="t-meta t-muted">{t('site.home.view.listNote')}</p>
    </div>
  )
}

function YearPreview() {
  const { t, locale, n } = useI18n()
  const counts = countByMonth(SAMPLE_RACES, PREVIEW_YEAR)

  return (
    <div className="preview">
      <div className="t-label">{t('site.home.view.year')}</div>
      <div className="preview__body" aria-hidden="true">
        <div className="preview__months">
          {counts.map((count, index) => (
            <span key={index}>
              {monthNameShort(index, locale)}
              <br />
              <span className={count ? 'preview__strong' : 't-muted'}>
                {count ? `● ${n(count)}` : t('app.year.marker.none')}
              </span>
            </span>
          ))}
        </div>
      </div>
      <p className="t-meta t-muted">{t('site.home.view.yearNote')}</p>
    </div>
  )
}

function MonthPreview() {
  const { t, locale } = useI18n()
  const entries = buildMonth(SAMPLE_RACES, PREVIEW_YEAR, PREVIEW_MONTH)
    .filter((entry) => entry.kind === 'day')
    .filter((entry) => entry.race || entry.continuation)

  return (
    <div className="preview">
      <div className="t-label">{t('site.home.view.month')}</div>
      <div className="preview__body" aria-hidden="true">
        {entries.map((entry) => (
          <div key={entry.iso} className="row">
            <span className="row__key">{dayKey(entry.date, locale)}</span>
            <Marker
              dot={Boolean(entry.race)}
              lineUp={entry.lineUp}
              lineDown={entry.lineDown}
            />
            <span className={entry.race ? 'preview__strong' : undefined}>
              {entry.race
                ? entry.race.name
                : t('app.month.continued', {
                    name: entry.continuation?.name ?? '',
                  })}
            </span>
          </div>
        ))}
      </div>
      <p className="t-meta t-muted">{t('site.home.view.monthNote')}</p>
    </div>
  )
}
