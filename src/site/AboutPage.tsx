/** À propos : pourquoi l'application existe, ce qu'elle refuse de faire,
 *  comment elle est faite, ce qu'il advient de vos données. */

import { Link } from 'react-router'
import { useI18n } from '../i18n/index.tsx'
import type { MessageKey } from '../i18n/index.tsx'
import { CONTACT, REPO } from '../lib/links.ts'
import { useDocumentMeta } from './SiteLayout.tsx'

const WHY: [MessageKey, MessageKey][] = [
  ['site.about.why.story', 'site.about.why.storyBody'],
  ['site.about.why.last', 'site.about.why.lastBody'],
  ['site.about.why.quiet', 'site.about.why.quietBody'],
]

const CHOICES: [MessageKey, MessageKey][] = [
  ['site.about.choice.manual', 'site.about.choice.manualNote'],
  ['site.about.choice.views', 'site.about.choice.viewsNote'],
  ['site.about.choice.mono', 'site.about.choice.monoNote'],
  ['site.about.choice.open', 'site.about.choice.openNote'],
]

const FAQ: [MessageKey, MessageKey][] = [
  ['site.about.faq.data', 'site.about.faq.dataBody'],
  ['site.about.faq.devices', 'site.about.faq.devicesBody'],
  ['site.about.faq.watch', 'site.about.faq.watchBody'],
  ['site.about.faq.price', 'site.about.faq.priceBody'],
  ['site.about.faq.stops', 'site.about.faq.stopsBody'],
]

export function AboutPage() {
  useDocumentMeta('site.about.metaTitle', 'site.about.metaDescription')
  const { t, raw } = useI18n()

  // La règle est mise en valeur au milieu de la phrase : on coupe le
  // gabarit sur son placeholder plutôt que d'éclater la clé en deux.
  const [intro = '', outro = ''] = raw('site.about.choicesIntro').split(
    '{rule}',
  )

  return (
    <>
      <section className="site__lede">
        <h1 className="site__h1">{t('site.about.title')}</h1>
        <p className="site__text">{t('site.about.lede')}</p>
      </section>

      <section>
        <h2 className="section-label section-label--strong">
          {t('site.about.why')}
        </h2>
        <ol>
          {WHY.map(([name, body], index) => (
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
          {t('site.about.choices')}
        </h2>
        <p className="site__intro">
          {intro}
          <strong className="numbered__name">
            {t('site.about.choicesRule')}
          </strong>
          {outro}
        </p>
        <ul className="pairs">
          {CHOICES.map(([name, note]) => (
            <li key={name} className="pairs__item">
              <div className="pairs__name">{t(name)}</div>
              <div className="pairs__note">{t(note)}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="section-label section-label--strong">
          {t('site.about.faq')}
        </h2>
        <dl>
          {FAQ.map(([question, answer]) => (
            <div key={question} className="deflist__item">
              <dt className="deflist__term">{t(question)}</dt>
              <dd className="deflist__def">{t(answer)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="closing">
        <div className="closing__text">
          <span className="t-body">{t('site.about.contact')}</span>
          <span className="t-meta t-muted">{t('site.about.contactNote')}</span>
        </div>
        <div className="inline-links">
          <a href={`${REPO}/issues`} rel="noreferrer noopener" target="_blank">
            {t('site.about.report')}
          </a>
          <a href={CONTACT}>{t('site.about.write')}</a>
          <Link to="/legal/terms">{t('site.about.legal')}</Link>
        </div>
      </section>
    </>
  )
}
