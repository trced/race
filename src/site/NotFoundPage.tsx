/** Page introuvable — constat, explication, sortie. */

import { Link } from 'react-router'
import { useI18n } from '../i18n/index.tsx'
import { useDocumentMeta } from './SiteLayout.tsx'

export function NotFoundPage() {
  useDocumentMeta('site.notfound.metaTitle', 'site.notfound.metaDescription')
  const { t } = useI18n()
  return (
    <section className="site__lede site__lede--split">
      <h1 className="site__h1">{t('site.notfound.title')}</h1>
      <p className="site__text">{t('site.notfound.body')}</p>
      <div className="inline-links">
        <Link to="/">{t('site.notfound.action')}</Link>
      </div>
    </section>
  )
}
