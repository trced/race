/** Runtime i18n : résolution de la langue, interpolation, pluriels.
 *  Aucun texte en dur dans un composant. */

import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { fr } from './fr.ts'
import type { MessageKey } from './fr.ts'
import { en } from './en.ts'
import type { LangSetting } from '../lib/types.ts'

export type Lang = 'fr' | 'en'
export type { MessageKey }

const DICTIONARIES: Record<Lang, Record<MessageKey, string>> = { fr, en }

/** Locale BCP 47 pour Intl. en-GB : dates « 28 August 2026 », comme en FR. */
const LOCALES: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' }

export type Vars = Record<string, string | number>

/** Résout « système » contre les langues du navigateur. */
export function resolveLang(setting: LangSetting): Lang {
  if (setting === 'fr' || setting === 'en') return setting
  const candidates =
    typeof navigator !== 'undefined'
      ? (navigator.languages ?? [navigator.language])
      : []
  for (const tag of candidates) {
    const base = String(tag ?? '').toLowerCase().split('-')[0]
    if (base === 'fr') return 'fr'
    if (base === 'en') return 'en'
  }
  return 'fr'
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = vars[name]
    return value === undefined ? match : String(value)
  })
}

export interface Translator {
  lang: Lang
  locale: string
  /** Traduit une clé, avec interpolation `{nom}`. */
  t: (key: MessageKey, vars?: Vars) => string
  /** Gabarit brut, placeholders compris — pour insérer un élément React
   *  au milieu d'une phrase sans la couper en deux clés. */
  raw: (key: MessageKey) => string
  /** Traduit `clé.one` / `clé.other` selon Intl.PluralRules. `{n}` est fourni. */
  tp: (base: string, count: number, vars?: Vars) => string
  /** Formate un nombre selon la locale. */
  n: (value: number) => string
}

function createTranslator(lang: Lang): Translator {
  const dict = DICTIONARIES[lang]
  const locale = LOCALES[lang]
  const plurals = new Intl.PluralRules(locale)
  const numbers = new Intl.NumberFormat(locale)

  const t = (key: MessageKey, vars?: Vars): string => {
    const template = dict[key] ?? fr[key] ?? key
    return interpolate(template, vars)
  }

  const tp = (base: string, count: number, vars?: Vars): string => {
    const category = plurals.select(count)
    const key = (`${base}.${category}` in dict
      ? `${base}.${category}`
      : `${base}.other`) as MessageKey
    return t(key, { n: numbers.format(count), ...vars })
  }

  const raw = (key: MessageKey): string => dict[key] ?? fr[key] ?? key

  return { lang, locale, t, raw, tp, n: (value) => numbers.format(value) }
}

const I18nContext = createContext<Translator>(createTranslator('fr'))

export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang
  children: ReactNode
}) {
  const value = useMemo(() => createTranslator(lang), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): Translator {
  return useContext(I18nContext)
}
