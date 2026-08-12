/** Journal des changements — le même contenu que CHANGELOG.md, bilingue. */

import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { changelogVersions } from '../data/changelog/index.ts'
import type { ChangeType } from '../data/changelog/index.ts'
import { formatDate } from '../lib/format.ts'
import { useDocumentMeta } from './SiteLayout.tsx'

const ORDER: ChangeType[] = ['added', 'changed', 'fixed', 'performance']

export function ChangelogPage() {
  useDocumentMeta('site.changelog.metaTitle', 'site.changelog.metaDescription')
  const { t, lang, locale } = useI18n()

  return (
    <>
      <section className="site__lede site__lede--split">
        <h1 className="site__h1">{t('site.changelog.title')}</h1>
        <p className="site__text">{t('site.changelog.lede')}</p>
      </section>

      {changelogVersions.map((release) => (
        <section key={release.version} className="release">
          <div className="release__head">
            <h2 className="release__version">{release.version}</h2>
            <span className="t-meta t-muted">
              {formatDate(release.date, locale)}
            </span>
          </div>

          {ORDER.filter((type) => release.changes[type]?.length).map((type) => (
            <div key={type} className="release__group">
              <div className="section-label">
                {t(`site.changelog.type.${type}` as MessageKey)}
              </div>
              <ul>
                {(release.changes[type] ?? []).map((item, index) => {
                  const text = lang === 'fr' ? item.text : item.textEn
                  const category =
                    lang === 'fr' ? item.category : item.categoryEn
                  return (
                    <li key={index} className="release__item">
                      <span className="release__marker" aria-hidden="true">
                        —
                      </span>
                      <span>
                        {category ? (
                          <span className="release__category">
                            {category} ·{' '}
                          </span>
                        ) : null}
                        {text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
