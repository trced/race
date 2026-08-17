/** Pages légales : conditions, confidentialité, mentions.
 *  Courtes par construction — l'application ne collecte rien. */

import { Link } from 'react-router'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { formatDate } from '../lib/format.ts'
import { CONTACT, CONTACT_EMAIL, LICENCE_URL, REPO } from '../lib/links.ts'
import { useDocumentMeta } from './SiteLayout.tsx'

/** Dernière révision des textes légaux, en ISO 8601. */
const UPDATED = '2026-08-11'

const TERMS: [MessageKey, MessageKey][] = [
  ['legal.terms.object', 'legal.terms.objectBody'],
  ['legal.terms.data', 'legal.terms.dataBody'],
  ['legal.terms.use', 'legal.terms.useBody'],
  ['legal.terms.licence', 'legal.terms.licenceBody'],
  ['legal.terms.warranty', 'legal.terms.warrantyBody'],
  ['legal.terms.changes', 'legal.terms.changesBody'],
]

const PRIVACY: [MessageKey, MessageKey][] = [
  ['legal.privacy.account', 'legal.privacy.accountBody'],
  ['legal.privacy.storage', 'legal.privacy.storageBody'],
  ['legal.privacy.analytics', 'legal.privacy.analyticsBody'],
  ['legal.privacy.cookies', 'legal.privacy.cookiesBody'],
  ['legal.privacy.third', 'legal.privacy.thirdBody'],
  ['legal.privacy.network', 'legal.privacy.networkBody'],
  ['legal.privacy.export', 'legal.privacy.exportBody'],
]

const NOTICE: [MessageKey, MessageKey | null][] = [
  ['legal.notice.publisher', 'legal.notice.publisherBody'],
  ['legal.notice.status', 'legal.notice.statusBody'],
  ['legal.notice.director', 'legal.notice.directorBody'],
  ['legal.notice.contact', null],
  ['legal.notice.host', 'legal.notice.hostBody'],
  ['legal.notice.ip', 'legal.notice.ipBody'],
  ['legal.notice.mediation', 'legal.notice.mediationBody'],
]

function LegalHead({ title, lede }: { title: string; lede: string }) {
  const { t, locale } = useI18n()
  return (
    <section className="site__lede">
      <div className="legal__head">
        <h1 className="site__h2">{title}</h1>
        <span className="t-meta t-muted">
          {t('legal.updated', { date: formatDate(UPDATED, locale) })}
        </span>
      </div>
      <p className="site__text t-label">{lede}</p>
    </section>
  )
}

function LegalLinks({ current }: { current: 'terms' | 'privacy' | 'notice' }) {
  const { t } = useI18n()
  return (
    <div className="legal__links">
      {current === 'terms' ? null : (
        <Link to="/legal/terms">{t('site.footer.terms')}</Link>
      )}
      {current === 'privacy' ? null : (
        <Link to="/legal/privacy">{t('site.footer.privacy')}</Link>
      )}
      {current === 'notice' ? null : (
        <Link to="/legal/notice">{t('site.footer.notice')}</Link>
      )}
      <a
        href={LICENCE_URL}
        rel="noreferrer noopener license"
        target="_blank"
      >
        {t('site.footer.licenceName')}
      </a>
    </div>
  )
}

export function TermsPage() {
  useDocumentMeta('legal.terms.metaTitle', 'legal.terms.metaDescription')
  const { t } = useI18n()
  return (
    <>
      <LegalHead title={t('legal.terms.title')} lede={t('legal.terms.lede')} />
      <section>
        <ol>
          {TERMS.map(([name, body], index) => (
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
        <LegalLinks current="terms" />
      </section>
    </>
  )
}

export function PrivacyPage() {
  useDocumentMeta('legal.privacy.metaTitle', 'legal.privacy.metaDescription')
  const { t } = useI18n()
  return (
    <>
      <LegalHead
        title={t('legal.privacy.title')}
        lede={t('legal.privacy.sub')}
      />
      <section>
        <p className="site__intro">{t('legal.privacy.lede')}</p>
        <div className="deflist__head" aria-hidden="true">
          <span>{t('legal.privacy.colSubject')}</span>
          <span>{t('legal.privacy.colAnswer')}</span>
        </div>
        <dl>
          {PRIVACY.map(([name, body]) => (
            <div key={name} className="deflist__item">
              <dt className="deflist__term">{t(name)}</dt>
              <dd className="deflist__def">{t(body)}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h2 className="section-label">{t('legal.privacy.rights')}</h2>
        <p className="site__intro t-dim">{t('legal.privacy.rightsBody')}</p>
        <LegalLinks current="privacy" />
      </section>
    </>
  )
}

export function NoticePage() {
  useDocumentMeta('legal.notice.metaTitle', 'legal.notice.metaDescription')
  const { t } = useI18n()
  return (
    <>
      <LegalHead
        title={t('legal.notice.title')}
        lede={t('legal.notice.lede')}
      />
      <section>
        <dl>
          {NOTICE.map(([name, body]) => (
            <div key={name} className="deflist__item">
              <dt className="deflist__term">{t(name)}</dt>
              <dd className="deflist__def">
                {body ? (
                  t(body)
                ) : (
                  <a href={CONTACT}>{CONTACT_EMAIL}</a>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="legal__links">
          <Link to="/legal/terms">{t('site.footer.terms')}</Link>
          <Link to="/legal/privacy">{t('site.footer.privacy')}</Link>
          <a href={REPO} rel="noreferrer noopener" target="_blank">
            {t('site.footer.repo')}
          </a>
        </div>
      </section>
    </>
  )
}
