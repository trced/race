/** État de l'application : les courses et les réglages.
 *  Une seule source, persistée localement.
 *
 *  Le mode exemple ne duplique pas les réglages : il ne remplace que la
 *  liste des courses. Le thème choisi depuis la démonstration est donc un
 *  vrai réglage, mais le journal de l'utilisateur n'est jamais touché. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { mergeRaces } from '../lib/io.ts'
import { SAMPLE_RACES } from '../lib/sample.ts'
import {
  EMPTY_STATE,
  isStorageAvailable,
  loadState,
  saveState,
  toFile,
} from '../lib/storage.ts'
import type { StoredState } from '../lib/storage.ts'
import type { Race, RaceFile, Settings } from '../lib/types.ts'
import { resolveLang } from '../i18n/index.tsx'
import type { Lang } from '../i18n/index.tsx'

export interface Store {
  races: Race[]
  settings: Settings
  lang: Lang
  /** Mode exemple : les courses ne sortent pas de l'onglet. */
  demo: boolean
  storageAvailable: boolean
  file: () => RaceFile
  addRace: (race: Race) => void
  updateRace: (race: Race) => void
  deleteRace: (id: string) => void
  replaceRaces: (races: Race[]) => void
  /** Fusionne et renvoie le nombre de courses réellement ajoutées. */
  mergeIncoming: (races: Race[]) => number
  eraseAll: () => void
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(() =>
    typeof window === 'undefined' ? EMPTY_STATE : loadState(),
  )
  const [storageAvailable] = useState(
    () => typeof window !== 'undefined' && isStorageAvailable(),
  )

  // Une seule écriture, au même endroit : impossible d'oublier de persister.
  // Rien n'est écrit à la simple ouverture — seulement quand l'état change.
  const untouched = useRef(true)
  useEffect(() => {
    if (untouched.current) {
      untouched.current = false
      return
    }
    saveState(state)
  }, [state])

  const lang = useMemo(
    () => resolveLang(state.settings.lang),
    [state.settings.lang],
  )

  // Seul le magasin racine touche au document.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    if (state.settings.theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.settings.theme)
  }, [lang, state.settings.theme])

  const patchRaces = useCallback((next: (races: Race[]) => Race[]) => {
    setState((s) => ({ ...s, races: next(s.races) }))
  }, [])

  const value = useMemo<Store>(
    () => ({
      races: state.races,
      settings: state.settings,
      lang,
      demo: false,
      storageAvailable,
      file: () => toFile(state),
      addRace: (race) => patchRaces((races) => races.concat([race])),
      updateRace: (race) =>
        patchRaces((races) => races.map((r) => (r.id === race.id ? race : r))),
      deleteRace: (id) =>
        patchRaces((races) => races.filter((r) => r.id !== id)),
      replaceRaces: (races) => patchRaces(() => races),
      mergeIncoming: (incoming) => {
        const result = mergeRaces(state.races, incoming)
        patchRaces(() => result.races)
        return result.added
      },
      eraseAll: () => patchRaces(() => []),
      setSetting: (key, val) =>
        setState((s) => ({ ...s, settings: { ...s.settings, [key]: val } })),
    }),
    [state, lang, storageAvailable, patchRaces],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

/** Surcouche exemple : mêmes réglages, courses en mémoire seulement. */
export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const parent = useStore()
  const [races, setRaces] = useState<Race[]>(SAMPLE_RACES)

  const value = useMemo<Store>(
    () => ({
      ...parent,
      races,
      demo: true,
      file: () => ({
        schemaVersion: parent.file().schemaVersion,
        data: { races },
        settings: parent.settings,
      }),
      addRace: (race) => setRaces((rs) => rs.concat([race])),
      updateRace: (race) =>
        setRaces((rs) => rs.map((r) => (r.id === race.id ? race : r))),
      deleteRace: (id) => setRaces((rs) => rs.filter((r) => r.id !== id)),
      replaceRaces: (next) => setRaces(next),
      mergeIncoming: (incoming) => {
        const result = mergeRaces(races, incoming)
        setRaces(result.races)
        return result.added
      },
      eraseAll: () => setRaces([]),
    }),
    [parent, races],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore doit être utilisé dans un StoreProvider')
  return store
}
