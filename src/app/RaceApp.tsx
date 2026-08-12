/** race. — l'application. Trois vues, une fiche, un formulaire, un panneau.
 *  Rien d'autre : elle répond à « qu'est-ce que j'ai couru ? ». */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { ListView } from './views/ListView.tsx'
import { MonthView } from './views/MonthView.tsx'
import { RecordsView } from './views/RecordsView.tsx'
import { YearView } from './views/YearView.tsx'
import { RaceDetailSheet } from './sheets/RaceDetailSheet.tsx'
import {
  RaceEditSheet,
  emptyDraft,
  toDraft,
} from './sheets/RaceEditSheet.tsx'
import { SettingsSheet } from './sheets/SettingsSheet.tsx'

type View = 'list' | 'year' | 'month' | 'records'
type Sort = 'dateDesc' | 'dateAsc' | 'distanceDesc'

const SORTS: Sort[] = ['dateDesc', 'dateAsc', 'distanceDesc']
const FLASH_MS = 3000

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

export function RaceApp({ embedded = false }: { embedded?: boolean }) {
  const { t, tp, locale } = useI18n()
  const store = useStore()
  const root = useRef<HTMLDivElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!root.current?.contains(document.activeElement)) return
      if (detail || edit || settingsOpen) return
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
  }, [detail, edit, settingsOpen, goToday, shift])

  // Un changement de vue ou de filtre repart du haut.
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0
  }, [view, year, month, sort, query, typeFilter])

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
  const hasRaces = store.races.length > 0

  const atToday = isYear
    ? year === now.getFullYear()
    : year === now.getFullYear() && month === now.getMonth()

  const openDetail = (race: Race): void => {
    setEdit(null)
    setDetail(race)
  }

  const openNew = (): void => {
    setDetail(null)
    setEdit({
      draft: emptyDraft(toISODate(new Date()), store.settings.unit),
      isNew: true,
      original: null,
    })
  }

  const openEdit = (race: Race): void => {
    setDetail(null)
    setEdit({
      draft: toDraft(race, store.settings.unit),
      isNew: false,
      original: race,
    })
  }

  const saveRace = (race: Race): void => {
    if (edit?.isNew) {
      const withId: Race = { ...race, id: newId() }
      store.addRace(withId)
      showFlash(t('app.flash.added', { name: withId.name }))
    } else {
      store.updateRace(race)
      showFlash(t('app.flash.saved', { name: race.name }))
    }
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
        : []

  return (
    <div
      ref={root}
      className={`app ${embedded ? 'app--embedded' : 'app--page'}`}
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
            <button
              type="button"
              className="app__brand"
              aria-label={t('app.nav.home')}
              onClick={() => setView(store.settings.defaultView)}
            >
              {t('common.brand')}
            </button>
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
          <button
            type="button"
            className="app__settings"
            onClick={() => setSettingsOpen(true)}
          >
            {t('app.nav.settings')}
          </button>
        </div>

        {isList ? (
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
                        (current) =>
                          SORTS[(SORTS.indexOf(current) + 1) % SORTS.length]!,
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
        ) : null}

        {isYear ? (
          <PeriodNav
            title={String(year)}
            prevLabel={String(year - 1)}
            nextLabel={String(year + 1)}
            prevAria={t('app.period.prevYear')}
            nextAria={t('app.period.nextYear')}
            caption={
              atToday ? t('app.period.today') : t('app.period.backToToday')
            }
            captionHint={t('app.period.hintYear', {
              year: now.getFullYear(),
            })}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            onToday={goToday}
          />
        ) : null}

        {isMonth ? (
          <PeriodNav
            title={`${monthName(month, locale)} ${year}`}
            prevLabel={monthName((month + 11) % 12, locale)}
            nextLabel={monthName((month + 1) % 12, locale)}
            prevAria={t('app.period.prevMonth')}
            nextAria={t('app.period.nextMonth')}
            caption={
              atToday ? t('app.period.today') : t('app.period.backToToday')
            }
            captionHint={t('app.period.hintMonth', {
              month: monthName(now.getMonth(), locale),
              year: now.getFullYear(),
            })}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            onToday={goToday}
          />
        ) : null}

        {isRecords ? (
          <div className="app__titleline">
            <span className="app__title">{t('app.records.title')}</span>
            <span className="app__count t-nowrap">
              {t('app.records.subtitle')}
            </span>
          </div>
        ) : null}
      </div>

      <div ref={scroll} className="app__scroll">
        {isList && !hasRaces ? (
          <EmptyState
            title={t('app.empty.title')}
            body={t('app.empty.body')}
            note={t('app.empty.note')}
            action={<Button onClick={openNew}>{t('app.empty.action')}</Button>}
          />
        ) : null}

        {isList && hasRaces && filtered.length === 0 ? (
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
        ) : null}

        {isList && filtered.length > 0 ? (
          <ListView
            races={filtered}
            showYears={sort !== 'distanceDesc'}
            onOpen={openDetail}
          />
        ) : null}

        {isYear ? (
          <YearView
            races={store.races}
            year={year}
            onOpenMonth={(index) => {
              setMonth(index)
              setView('month')
            }}
          />
        ) : null}

        {isMonth ? (
          <MonthView
            races={store.races}
            year={year}
            month={month}
            onOpen={openDetail}
          />
        ) : null}

        {isRecords ? (
          <RecordsView races={store.races} onOpen={openDetail} />
        ) : null}
      </div>

      <div className="app__foot">
        <div className="app__foot-group">
          {isYear ? null : (
            <Button onClick={() => setView('year')}>
              {isMonth ? t('app.month.backToYear') : t('app.nav.byYear')}
            </Button>
          )}
          {isRecords ? null : (
            <Button variant="quiet" onClick={() => setView('records')}>
              {t('app.nav.records')}
            </Button>
          )}
        </div>
        <Button variant="primary" onClick={openNew}>
          {t('app.nav.add')}
        </Button>
      </div>

      {settingsOpen ? (
        <SettingsSheet
          onClose={() => setSettingsOpen(false)}
          onFlash={showFlash}
        />
      ) : null}

      {detail ? (
        <RaceDetailSheet
          race={detail}
          onClose={() => setDetail(null)}
          onEdit={() => openEdit(detail)}
          onDelete={() => removeRace(detail)}
        />
      ) : null}

      {edit ? (
        <RaceEditSheet
          draft={edit.draft}
          isNew={edit.isNew}
          original={edit.original}
          onClose={() => setEdit(null)}
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
