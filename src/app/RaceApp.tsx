/** race. — l'application. Quatre destinations, une fiche, un formulaire, un
 *  panneau. Rien d'autre : elle répond à « qu'est-ce que j'ai couru ? ».
 *
 *  Une logique, trois mises en page :
 *  — téléphone : une colonne, les destinations au pouce dans le pied, la
 *    profondeur par le fil d'Ariane, la fiche par une feuille ;
 *  — tablette  : une colonne, les destinations en barre haute ;
 *  — large     : deux colonnes — la liste à gauche en permanence, la vue
 *    courante à droite. Les destinations deviennent voisines, pas des
 *    sous-pages, et la fiche n'a plus à recouvrir la liste. */

import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router'
import { Button } from '../components/Button.tsx'
import { EmptyState } from '../components/Feedback.tsx'
import { PeriodNav } from '../components/PeriodNav.tsx'
import { SelectField, TextField } from '../components/TextField.tsx'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { monthName, toISODate } from '../lib/format.ts'
import { RACE_TYPES } from '../lib/types.ts'
import type { Race } from '../lib/types.ts'
import type { RaceDraft } from '../lib/validate.ts'
import { useStore } from '../state/store.tsx'
import { useMediaQuery } from './useMediaQuery.ts'
import { ListView } from './views/ListView.tsx'
import { MonthView } from './views/MonthView.tsx'
import { RecordsView } from './views/RecordsView.tsx'
import { YearView } from './views/YearView.tsx'
import { RaceDetail, RaceDetailSheet } from './sheets/RaceDetailSheet.tsx'
import { RaceEditForm, RaceEditSheet, emptyDraft, toDraft } from './sheets/RaceEditSheet.tsx'
import { SettingsSheet } from './sheets/SettingsSheet.tsx'

type View = 'list' | 'year' | 'month' | 'records' | 'curves'
type Sort = 'dateDesc' | 'dateAsc' | 'distanceDesc'

const SORTS: Sort[] = ['dateDesc', 'dateAsc', 'distanceDesc']

/** Les destinations autres que la liste, dans l'ordre où elles se présentent
 *  partout — barre haute comme pied du téléphone. */
const DESTINATIONS: [Exclude<View, 'list' | 'month'>, MessageKey][] = [
  ['year', 'app.nav.tab.year'],
  ['records', 'app.nav.tab.records'],
  ['curves', 'app.nav.tab.curves'],
]

/** Le tracé embarque une bibliothèque : elle arrive à part, pour que la liste
 *  et la page de présentation n'aient pas à la porter. Hors ligne elle est
 *  déjà là — le worker précache tous les morceaux produits. */
const CurvesView = lazy(() =>
  import('./views/CurvesView.tsx')
    .then((module) => ({ default: module.CurvesView }))
    // Sans ce filet, un morceau qui n'arrive pas emporte l'arbre entier.
    .catch(() => ({ default: CurvesUnavailable })),
)

function CurvesUnavailable() {
  const { t } = useI18n()
  return (
    <div className="curves">
      <EmptyState
        title={t('app.curves.error.title')}
        body={t('app.curves.error.body')}
      />
    </div>
  )
}

const FLASH_MS = 3000

/** Au-delà, les destinations quittent le pied pour une barre haute : à la
 *  souris rien n'oblige à les garder à portée de pouce, et une barre en bas
 *  d'un écran de 800 px est loin du contenu. */
const HAS_BAR = '(min-width: 640px)'

/** Au-delà, la liste reste à gauche et la vue courante occupe la droite. */
const WIDE = '(min-width: 1100px)'

interface EditState {
  draft: RaceDraft
  isNew: boolean
  original: Race | null
}

/** Identifiant local d'une course. Jamais transmis, jamais partagé. */
function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `r${Date.now().toString(36)}`
}

/** La plus récente — celle qu'on veut lire en arrivant. */
function latestRace(races: Race[]): Race | null {
  let latest: Race | null = null
  for (const race of races) {
    if (!latest || race.date > latest.date) latest = race
  }
  return latest
}

export function RaceApp({ embedded = false }: { embedded?: boolean }) {
  const { t, tp, locale } = useI18n()
  const store = useStore()
  const root = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const pane = useRef<HTMLElement>(null)
  const paneScroll = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // L'encart de la page de présentation fait 390 px de large dans une fenêtre
  // qui en fait mille : il garde la coque du téléphone, c'est ce qu'il montre.
  const hasBar = useMediaQuery(HAS_BAR) && !embedded
  const wide = useMediaQuery(WIDE) && !embedded

  const now = useMemo(() => new Date(), [])
  const [view, setView] = useState<View>(store.settings.defaultView)
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sort, setSort] = useState<Sort>('dateDesc')
  const [detail, setDetail] = useState<Race | null>(null)
  const [edit, setEdit] = useState<EditState | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [flash, setFlash] = useState('')

  const showFlash = useCallback((message: string) => {
    clearTimeout(flashTimer.current)
    setFlash(message)
    flashTimer.current = setTimeout(() => setFlash(''), FLASH_MS)
  }, [])

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  // Le titre du document suit la langue — l'encart de la page de
  // présentation, lui, ne touche pas au document.
  useEffect(() => {
    if (embedded) return
    document.title = `${t('common.brand')} — ${t('app.list.title')}`
  }, [embedded, t])

  const goToday = useCallback(() => {
    const today = new Date()
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }, [])

  const shift = useCallback(
    (step: number) => {
      if (view === 'year') {
        setYear((y) => y + step)
        return
      }
      if (view !== 'month') return
      const next = month + step
      if (next < 0) {
        setMonth(11)
        setYear((y) => y - 1)
      } else if (next > 11) {
        setMonth(0)
        setYear((y) => y + 1)
      } else {
        setMonth(next)
      }
    },
    [view, month],
  )

  // Raccourcis clavier — actifs seulement quand le focus est dans l'app.
  // Une fiche ouverte dans la colonne de droite ne bloque rien : elle n'est
  // pas modale. Une feuille, un formulaire ou les réglages, si.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!root.current?.contains(document.activeElement)) return
      if (settingsOpen || edit) return
      if (detail && !wide) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      ) {
        return
      }
      if (event.key.toLowerCase() === 't') goToday()
      else if (event.key === 'ArrowLeft') shift(-1)
      else if (event.key === 'ArrowRight') shift(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [detail, edit, settingsOpen, wide, goToday, shift])

  // Sur deux colonnes, celle de droite ne reste pas vide tant qu'il existe une
  // course : sans sélection, elle montre la plus récente. Le seul cas de
  // colonne vide est donc « aucune course enregistrée ».
  useEffect(() => {
    if (!wide || detail || edit) return
    const latest = latestRace(store.races)
    if (latest) setDetail(latest)
  }, [wide, detail, edit, store.races])

  // En quittant les deux colonnes, la fiche choisie d'office n'a pas à
  // devenir une feuille modale par-dessus la liste. Un formulaire en cours,
  // lui, survit — le perdre sur un coup de souris serait pire.
  useEffect(() => {
    if (wide) return
    setDetail(null)
  }, [wide])

  // La colonne de droite n'est pas modale : Sheet ne gère donc pas son Échap.
  // Seul le formulaire s'y referme — la fiche, elle, n'a nulle part où aller.
  useEffect(() => {
    if (!wide || !edit) return
    pane.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Les réglages, en feuille par-dessus, traitent Échap avant en capture
      // et arrêtent la propagation : cet écouteur ne la voit pas.
      if (!root.current?.contains(document.activeElement)) return
      if (edit.original) setDetail(edit.original)
      setEdit(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [wide, edit])

  // Un filtre repart du haut de la liste ; une destination, du haut de la
  // colonne qui la porte.
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0
  }, [sort, query, typeFilter])

  useEffect(() => {
    const column = wide ? paneScroll.current : scroll.current
    if (column) column.scrollTop = 0
  }, [wide, view, year, month])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return store.races
      .filter((race) => {
        if (typeFilter !== 'all' && race.type !== typeFilter) return false
        if (!needle) return true
        return [race.name, race.location, race.type, race.notes, race.date]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      })
      .sort((a, b) => {
        if (sort === 'distanceDesc') return Number(b.distance) - Number(a.distance)
        if (sort === 'dateAsc') return a.date < b.date ? -1 : 1
        return a.date < b.date ? 1 : -1
      })
  }, [store.races, query, typeFilter, sort])

  const usedTypes = useMemo(
    () => RACE_TYPES.filter((type) => store.races.some((r) => r.type === type)),
    [store.races],
  )

  const isList = view === 'list'
  const isYear = view === 'year'
  const isMonth = view === 'month'
  const isRecords = view === 'records'
  const isCurves = view === 'curves'
  const hasRaces = store.races.length > 0

  const atToday = isYear
    ? year === now.getFullYear()
    : year === now.getFullYear() && month === now.getMonth()

  // Sur deux colonnes, ouvrir une course ou un formulaire ramène la colonne
  // de droite sur « courses » : elle ne montre qu'une chose à la fois.
  const showCard = (): void => {
    if (wide) setView('list')
  }

  const openDetail = (race: Race): void => {
    setEdit(null)
    setDetail(race)
    showCard()
  }

  const openNew = (): void => {
    setDetail(null)
    setEdit({
      draft: emptyDraft(toISODate(new Date()), store.settings.unit),
      isNew: true,
      original: null,
    })
    showCard()
  }

  const openEdit = (race: Race): void => {
    setDetail(null)
    setEdit({
      draft: toDraft(race, store.settings.unit),
      isNew: false,
      original: race,
    })
    showCard()
  }

  /** Quitter le formulaire rend la fiche d'où l'on venait, pas la plus
   *  récente. En feuille, il n'y a rien à rendre : on referme. */
  const closeEdit = (): void => {
    if (wide && edit?.original) setDetail(edit.original)
    setEdit(null)
  }

  const saveRace = (race: Race): void => {
    const saved: Race = edit?.isNew ? { ...race, id: newId() } : race
    if (edit?.isNew) {
      store.addRace(saved)
      showFlash(t('app.flash.added', { name: saved.name }))
    } else {
      store.updateRace(saved)
      showFlash(t('app.flash.saved', { name: saved.name }))
    }
    // La colonne de droite montre ce qui vient d'être écrit, pas autre chose.
    if (wide) setDetail(saved)
    setEdit(null)
  }

  const removeRace = (race: Race): void => {
    store.deleteRace(race.id)
    setDetail(null)
    setEdit(null)
    showFlash(t('app.flash.deleted', { name: race.name }))
  }

  const resultLabel = !hasRaces
    ? ''
    : filtered.length === store.races.length
      ? tp('app.list.count', filtered.length)
      : t('app.list.countFiltered', {
          n: filtered.length,
          total: store.races.length,
        })

  const crumbs = isYear
    ? [{ label: String(year), to: null }]
    : isMonth
      ? [
          { label: String(year), to: 'year' as const },
          { label: monthName(month, locale), to: null },
        ]
      : isRecords
        ? [{ label: t('app.records.title'), to: null }]
        : isCurves
          ? [{ label: t('app.curves.title'), to: null }]
          : []

  // — les morceaux, posés ensuite à leur place selon la mise en page —

  const listHead = (
    <div className="app__listhead">
      <div className="app__titleline">
        <span className="app__title">{t('app.list.title')}</span>
        <div className="app__titleaside">
          {flash ? (
            <span role="status" className="app__status">
              ✓ {flash}
            </span>
          ) : (
            <span className="app__count" aria-live="polite">
              {resultLabel}
            </span>
          )}
          {hasRaces ? (
            <button
              type="button"
              className="app__sort"
              aria-label={t('app.list.sortAria', {
                value: t(`app.list.sortName.${sort}` as MessageKey),
              })}
              onClick={() =>
                setSort(
                  (current) => SORTS[(SORTS.indexOf(current) + 1) % SORTS.length]!,
                )
              }
            >
              {t(`app.list.sort.${sort}` as MessageKey)}
            </button>
          ) : null}
        </div>
      </div>
      {hasRaces ? (
        <div className="searchbar">
          <div className="searchbar__field">
            <TextField
              hideLabel
              clearable
              label={t('app.list.searchLabel')}
              clearLabel={t('app.list.clearSearch')}
              placeholder={t('app.list.searchPlaceholder')}
              value={query}
              onValueChange={setQuery}
              onClear={() => setQuery('')}
            />
          </div>
          <SelectField
            bare
            selectClassName="searchbar__select"
            label={t('app.list.filterLabel')}
            value={typeFilter}
            onValueChange={setTypeFilter}
            options={[
              { value: 'all', label: t('app.list.allTypes') },
              ...usedTypes.map((type) => ({
                value: type,
                label: t(`app.type.${type}` as MessageKey),
              })),
            ]}
          />
        </div>
      ) : null}
    </div>
  )

  const periodHead = isYear ? (
    <PeriodNav
      title={String(year)}
      prevLabel={String(year - 1)}
      nextLabel={String(year + 1)}
      prevAria={t('app.period.prevYear')}
      nextAria={t('app.period.nextYear')}
      caption={atToday ? t('app.period.today') : t('app.period.backToToday')}
      captionHint={t('app.period.hintYear', { year: now.getFullYear() })}
      onPrev={() => shift(-1)}
      onNext={() => shift(1)}
      onToday={goToday}
    />
  ) : isMonth ? (
    <PeriodNav
      title={`${monthName(month, locale)} ${year}`}
      prevLabel={monthName((month + 11) % 12, locale)}
      nextLabel={monthName((month + 1) % 12, locale)}
      prevAria={t('app.period.prevMonth')}
      nextAria={t('app.period.nextMonth')}
      caption={atToday ? t('app.period.today') : t('app.period.backToToday')}
      captionHint={t('app.period.hintMonth', {
        month: monthName(now.getMonth(), locale),
        year: now.getFullYear(),
      })}
      onPrev={() => shift(-1)}
      onNext={() => shift(1)}
      onToday={goToday}
    />
  ) : isRecords ? (
    <div className="app__titleline">
      <span className="app__title">{t('app.records.title')}</span>
      <span className="app__count t-nowrap">{t('app.records.subtitle')}</span>
    </div>
  ) : isCurves ? (
    <div className="app__titleline">
      <span className="app__title">{t('app.curves.title')}</span>
      <span className="app__count t-nowrap">{t('app.curves.subtitle')}</span>
    </div>
  ) : null

  const listContent = (
    <>
      {!hasRaces ? (
        <EmptyState
          title={t('app.empty.title')}
          body={t('app.empty.body')}
          note={t('app.empty.note')}
          action={<Button onClick={openNew}>{t('app.empty.action')}</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('app.noresults.title')}
          body={t('app.noresults.body')}
          action={
            <Button
              onClick={() => {
                setQuery('')
                setTypeFilter('all')
              }}
            >
              {t('app.noresults.action')}
            </Button>
          }
        />
      ) : (
        <ListView
          races={filtered}
          showYears={sort !== 'distanceDesc'}
          selectedId={wide && isList ? detail?.id : undefined}
          onOpen={openDetail}
        />
      )}
    </>
  )

  const periodContent = isYear ? (
    <YearView
      races={store.races}
      year={year}
      onOpenMonth={(index) => {
        setMonth(index)
        setView('month')
      }}
    />
  ) : isMonth ? (
    <MonthView
      races={store.races}
      year={year}
      month={month}
      onOpen={openDetail}
    />
  ) : isRecords ? (
    <RecordsView races={store.races} onOpen={openDetail} />
  ) : isCurves ? (
    <Suspense
      fallback={
        <div className="curves">
          <p className="curves__note">{t('app.curves.loading')}</p>
        </div>
      }
    >
      <CurvesView races={store.races} onOpen={openDetail} />
    </Suspense>
  ) : null

  const cardContent = edit ? (
    <RaceEditForm
      draft={edit.draft}
      isNew={edit.isNew}
      original={edit.original}
      onClose={closeEdit}
      onSave={saveRace}
      onDelete={() => {
        const race = edit.original
        if (race) removeRace(race)
        else setEdit(null)
      }}
    />
  ) : detail ? (
    <RaceDetail
      race={detail}
      onEdit={() => openEdit(detail)}
      onDelete={() => removeRace(detail)}
    />
  ) : null

  // D'où l'on revient, et vers quoi. Nommer la destination — « ‹ 2026 » —
  // dit exactement où l'on retombe ; « retour » ne le dit pas. Sans barre,
  // ce retour occupe la première place du pied : la vue année et la vue
  // records n'en avaient aucun, seul le logo ramenait à la liste.
  const back: { view: View; label: string } | null = isList
    ? null
    : isMonth
      ? { view: 'year', label: String(year) }
      : { view: 'list', label: t('app.list.title') }

  const paneLabel = isYear
    ? String(year)
    : isMonth
      ? `${monthName(month, locale)} ${year}`
      : isRecords
        ? t('app.records.title')
        : isCurves
          ? t('app.curves.title')
          : t('app.detail.label')

  /** Les destinations où l'on n'est pas déjà. Le mois compte pour l'année. */
  const elsewhere = DESTINATIONS.filter(
    ([key]) => key !== (isMonth ? 'year' : view),
  )

  return (
    <div
      ref={root}
      className={`app ${embedded ? 'app--embedded' : 'app--page'}${
        wide ? ' app--wide' : ''
      }`}
    >
      {/* Sur la page de présentation, la légende sous le cadre dit déjà ce
          qu'est cette application : le bandeau ferait doublon. En plein
          écran, en revanche, rien d'autre ne le dirait. */}
      {store.demo && !embedded ? (
        <div className="app__demo">
          <span>
            {t('app.demo.label')} — {t('app.demo.note')}
          </span>
          <Link className="t-meta" to="/app">
            {t('app.demo.leave')}
          </Link>
        </div>
      ) : null}

      <div className="app__head">
        <div className="app__topline">
          <nav className="app__crumbs" aria-label={t('app.nav.breadcrumb')}>
            {/* Avec la barre, « courses » est déjà là : un logo cliquable
                ferait doublon. Sans elle, il est le retour à l'accueil. */}
            {hasBar ? (
              <span className="app__brand">{t('common.brand')}</span>
            ) : (
              <button
                type="button"
                className="app__brand"
                aria-label={t('app.nav.home')}
                onClick={() => setView(store.settings.defaultView)}
              >
                {t('common.brand')}
              </button>
            )}
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="app__crumb">
                <span aria-hidden="true" className="t-meta t-muted">
                  ›
                </span>
                {crumb.to ? (
                  <button
                    type="button"
                    className="app__crumb-link"
                    onClick={() => setView('year')}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span aria-current="page" className="app__crumb-current">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          {hasBar ? (
            <ViewTabs
              view={view}
              onView={setView}
              onSettings={() => setSettingsOpen(true)}
            />
          ) : (
            <button
              type="button"
              className="app__settings"
              onClick={() => setSettingsOpen(true)}
            >
              {t('app.nav.settings')}
            </button>
          )}
        </div>

        {/* Sans barre, la tête de la vue courante suit le fil d'Ariane ;
            avec, chaque colonne porte la sienne. */}
        {hasBar ? null : isList ? listHead : periodHead}
      </div>

      <div className="app__body">
        <div className="app__main">
          {hasBar ? (
            <div className="app__subhead">
              {wide ? listHead : isList ? listHead : periodHead}
            </div>
          ) : null}

          <div ref={scroll} className="app__scroll">
            {wide ? listContent : isList ? listContent : periodContent}
          </div>

          <div className="app__foot">
            {hasBar ? null : (
              <div className="app__foot-group">
                {back ? (
                  <Button onClick={() => setView(back.view)}>
                    {t('app.nav.back', { label: back.label })}
                  </Button>
                ) : null}
                {elsewhere.map(([key, label]) => (
                  <Button
                    key={key}
                    variant="quiet"
                    onClick={() => setView(key)}
                  >
                    {t(label)}
                  </Button>
                ))}
              </div>
            )}
            <Button variant="primary" onClick={openNew}>
              {t('app.nav.add')}
            </Button>
          </div>
        </div>

        {wide ? (
          <aside
            ref={pane}
            tabIndex={-1}
            aria-label={paneLabel}
            className="app__pane"
          >
            {periodHead ? (
              <div className="app__subhead">{periodHead}</div>
            ) : null}
            <div ref={paneScroll} className="app__pane-body">
              {periodContent ??
                (cardContent ? (
                  <div className="app__card">{cardContent}</div>
                ) : null)}
            </div>
          </aside>
        ) : null}
      </div>

      {settingsOpen ? (
        <SettingsSheet
          onClose={() => setSettingsOpen(false)}
          onFlash={showFlash}
        />
      ) : null}

      {!wide && detail ? (
        <RaceDetailSheet
          race={detail}
          onClose={() => setDetail(null)}
          onEdit={() => openEdit(detail)}
          onDelete={() => removeRace(detail)}
        />
      ) : null}

      {!wide && edit ? (
        <RaceEditSheet
          draft={edit.draft}
          isNew={edit.isNew}
          original={edit.original}
          onClose={closeEdit}
          onSave={saveRace}
          onDelete={() => {
            const race = edit.original
            if (race) removeRace(race)
            else setEdit(null)
          }}
        />
      ) : null}
    </div>
  )
}

/** Barre de destinations — tablette et au-delà. Les vues en libellés texte,
 *  l'active soulignée d'un trait : l'état se lit, il ne se colore pas.
 *  « réglages » suit un filet vertical : ce n'est pas une vue du carnet. */
function ViewTabs({
  view,
  onView,
  onSettings,
}: {
  view: View
  onView: (next: View) => void
  onSettings: () => void
}) {
  const { t } = useI18n()

  const TABS: [View, MessageKey][] = [
    ['list', 'app.nav.tab.races'],
    ...DESTINATIONS,
  ]

  // Le mois est une profondeur de l'année, pas une destination : c'est
  // « année » qui reste soulignée, et le fil d'Ariane qui dit où l'on est.
  const active: View = view === 'month' ? 'year' : view

  return (
    <nav className="app__tabs" aria-label={t('app.nav.views')}>
      {TABS.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className="app__tab"
          {...(key === active ? { 'aria-current': 'page' as const } : {})}
          onClick={() => onView(key)}
        >
          {t(label)}
        </button>
      ))}
      <span className="app__tabs-rule" aria-hidden="true" />
      <button type="button" className="app__tab" onClick={onSettings}>
        {t('app.nav.settings')}
      </button>
    </nav>
  )
}
