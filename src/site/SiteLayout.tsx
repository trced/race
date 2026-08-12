/** Coque des pages web : en-tête, contenu, pied de page.
 *  Le bouton de langue est le seul contrôle permanent en dehors de la nav. */

import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { CONTACT, CONTACT_EMAIL, LICENCE_URL, REPO } from '../lib/links.ts'
import { APP_VERSION } from '../lib/version.ts'
import { useStore } from '../state/store.tsx'

/** Renseigne le titre et la description sans dépendance de plus. */
export function useDocumentMeta(titleKey: MessageKey, descriptionKey?: MessageKey) {
  const { t } = useI18n()
  const title = t(titleKey)
  const description = descriptionKey ? t(descriptionKey) : null

  useEffect(() => {
    document.title = title
    if (!description) return
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description
  }, [title, description])
}

export function SiteLayout() {
  const { t, lang } = useI18n()
  const { setSetting } = useStore()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="site">
      <a className="skip-link" href="#content">
        {t('common.skipToContent')}
      </a>
      <div className="site__inner">
        <header className="site__header">
          <Link className="site__brand" to="/">
            {t('common.brand')}
          </Link>
          <nav className="site__nav">
            <NavLink to="/" end>
              {t('site.nav.home')}
            </NavLink>
            <NavLink to="/about">{t('site.nav.about')}</NavLink>
            <NavLink className="site__nav-wide" to="/app">
              {t('site.nav.app')}
            </NavLink>
            <a
              className="site__nav-wide"
              href={REPO}
              rel="noreferrer noopener"
              target="_blank"
            >
              {t('site.nav.source')}
            </a>
            <button
              type="button"
              className="btn btn--quiet"
              aria-label={t('site.nav.langAria')}
              onClick={() => setSetting('lang', lang === 'fr' ? 'en' : 'fr')}
            >
              {t('site.nav.lang')}
            </button>
          </nav>
        </header>

        <main id="content" className="site__main">
          <Outlet />
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="site__footer">
      <div>
        <div className="section-label">{t('site.footer.project')}</div>
        <ul className="site__footer-list">
          <li>
            <a href={REPO} rel="noreferrer noopener" target="_blank">
              {t('site.footer.repo')}
            </a>
          </li>
          <li>
            <a
              href={`${REPO}/releases`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {t('site.footer.releases')}
            </a>
          </li>
          <li>
            <a
              href={`${REPO}/issues`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {t('site.footer.issues')}
            </a>
          </li>
          <li>
            <Link to="/about">{t('site.footer.about')}</Link>
          </li>
          <li>
            <Link to="/changelog">{t('site.footer.changelog')}</Link>
          </li>
        </ul>
      </div>

      <div>
        <div className="section-label">{t('site.footer.licence')}</div>
        <ul className="site__footer-list">
          <li>
            <a
              href={LICENCE_URL}
              rel="noreferrer noopener license"
              target="_blank"
            >
              {t('site.footer.licenceName')}
            </a>
          </li>
          <li>
            <a
              href={`${REPO}/blob/main/CONTRIBUTING.md`}
              rel="noreferrer noopener"
              target="_blank"
            >
              {t('site.footer.contribute')}
            </a>
          </li>
        </ul>
        <p className="site__footer-note">{t('site.footer.licenceNote')}</p>
      </div>

      <div>
        <div className="section-label">{t('site.footer.legal')}</div>
        <ul className="site__footer-list">
          <li>
            <Link to="/legal/terms">{t('site.footer.terms')}</Link>
          </li>
          <li>
            <Link to="/legal/privacy">{t('site.footer.privacy')}</Link>
          </li>
          <li>
            <Link to="/legal/notice">{t('site.footer.notice')}</Link>
          </li>
        </ul>
      </div>

      <div>
        <div className="section-label">{t('site.footer.contact')}</div>
        <ul className="site__footer-list">
          <li>
            <a href={CONTACT}>{CONTACT_EMAIL}</a>
          </li>
        </ul>
        <p className="site__footer-note">
          {t('site.footer.version', { version: APP_VERSION })}
        </p>
      </div>
    </footer>
  )
}
