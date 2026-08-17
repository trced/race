/** Panneau de réglages : affichage, données, à propos.
 *  Chaque ligne défile ses valeurs au clic ; le changement s'applique aussitôt. */

import { useRef, useState } from 'react'
import { Button } from '../../components/Button.tsx'
import { Confirm } from '../../components/Feedback.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import {
  ActionRow,
  LinkRow,
  StaticRow,
  ToggleRow,
} from '../../components/ToggleRow.tsx'
import { useI18n } from '../../i18n/index.tsx'
import type { MessageKey } from '../../i18n/index.tsx'
import { downloadFile, parseFile, shareFile } from '../../lib/io.ts'
import { LICENCE_URL, REPO } from '../../lib/links.ts'
import type { Race, Settings } from '../../lib/types.ts'
import { APP_VERSION } from '../../lib/version.ts'
import { useStore } from '../../state/store.tsx'

/** Une ligne de réglage : les valeurs possibles, dans l'ordre du cycle. */
interface Cycle<K extends keyof Settings> {
  key: K
  labelKey: MessageKey
  values: readonly Settings[K][]
  valueKey: (value: Settings[K]) => MessageKey
}

const CYCLES = [
  {
    key: 'theme',
    labelKey: 'app.settings.theme',
    values: ['system', 'light', 'dark'],
    valueKey: (v) => `app.settings.theme.${v}` as MessageKey,
  } satisfies Cycle<'theme'>,
  {
    key: 'lang',
    labelKey: 'app.settings.lang',
    values: ['system', 'fr', 'en'],
    valueKey: (v) => `app.settings.lang.${v}` as MessageKey,
  } satisfies Cycle<'lang'>,
  {
    key: 'unit',
    labelKey: 'app.settings.unit',
    values: ['km', 'mi'],
    valueKey: (v) => `app.settings.unit.${v}` as MessageKey,
  } satisfies Cycle<'unit'>,
  {
    key: 'pace',
    labelKey: 'app.settings.pace',
    values: ['shown', 'hidden'],
    valueKey: (v) => `app.settings.pace.${v}` as MessageKey,
  } satisfies Cycle<'pace'>,
  {
    key: 'defaultView',
    labelKey: 'app.settings.defaultView',
    values: ['list', 'year', 'month'],
    valueKey: (v) => `app.settings.view.${v}` as MessageKey,
  } satisfies Cycle<'defaultView'>,
] as const

type Pending =
  | { state: 'idle' }
  | { state: 'ready'; filename: string; races: Race[] }
  | { state: 'error'; message: MessageKey }

const REASON_KEY = {
  unreadable: 'app.import.errorUnreadable',
  schema: 'app.import.errorSchema',
  version: 'app.import.errorVersion',
} as const

export function SettingsSheet({
  onClose,
  onFlash,
}: {
  onClose: () => void
  onFlash: (message: string) => void
}) {
  const { t, tp } = useI18n()
  const store = useStore()
  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Pending>({ state: 'idle' })
  const [askErase, setAskErase] = useState(false)

  const count = store.races.length

  const cycle = <K extends keyof Settings>(entry: Cycle<K>): void => {
    const values = entry.values
    const index = values.indexOf(store.settings[entry.key])
    const next = values[(index + 1) % values.length]
    if (next !== undefined) store.setSetting(entry.key, next)
    setPending({ state: 'idle' })
    setAskErase(false)
  }

  const onExport = (): void => {
    downloadFile(store.file())
    onFlash(tp('app.flash.exported', count))
    onClose()
  }

  const onSend = async (): Promise<void> => {
    const result = await shareFile(store.file())
    if (result === 'cancelled') return
    onFlash(
      result === 'shared'
        ? t('app.flash.shared')
        : tp('app.flash.exported', count),
    )
    onClose()
  }

  const onPickFile = async (file: File): Promise<void> => {
    const text = await file.text()
    const result = parseFile(text)
    if (!result.ok) {
      setPending({ state: 'error', message: REASON_KEY[result.reason] })
      return
    }
    if (result.file.data.races.length === 0) {
      setPending({ state: 'error', message: 'app.import.errorEmpty' })
      return
    }
    setPending({
      state: 'ready',
      filename: file.name,
      races: result.file.data.races,
    })
  }

  const openPicker = (): void => {
    setAskErase(false)
    setPending({ state: 'idle' })
    fileInput.current?.click()
  }

  return (
    <Sheet full label={t('app.settings.title')} onClose={onClose}>
      <div className="settings__head">
        <span className="t-brand">{t('app.settings.title')}</span>
        <Button variant="quiet" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>

      <div className="settings__body">
        <section>
          <div className="section-label">{t('app.settings.display')}</div>
          {CYCLES.map((entry) => {
            const value = t(
              entry.valueKey(store.settings[entry.key] as never),
            )
            const name = t(entry.labelKey)
            return (
              <ToggleRow
                key={entry.key}
                name={name}
                value={value}
                ariaLabel={t('app.settings.cycleAria', { name, value })}
                onCycle={() => cycle(entry as Cycle<keyof Settings>)}
              />
            )
          })}
          <p className="settings__note">{t('app.settings.displayNote')}</p>
        </section>

        <section>
          <div className="section-label">{t('app.settings.data')}</div>

          <ActionRow
            name={t('app.settings.export')}
            value={t('app.settings.exportValue')}
            onClick={onExport}
          />

          <ActionRow
            name={t('app.settings.send')}
            value={t('app.settings.sendValue')}
            onClick={() => void onSend()}
          />

          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) void onPickFile(file)
            }}
          />

          {pending.state === 'ready' ? (
            <div className="confirm">
              <p className="confirm__title">
                {tp('app.settings.importFound', pending.races.length, {
                  file: pending.filename,
                })}
              </p>
              <p className="confirm__body">
                {count === 0
                  ? t('app.settings.importExplainEmpty')
                  : t('app.settings.importExplain', { n: count })}
              </p>
              <div className="confirm__actions">
                <Button
                  variant="quiet"
                  onClick={() => setPending({ state: 'idle' })}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={() => {
                    const added = store.mergeIncoming(pending.races)
                    setPending({ state: 'idle' })
                    onFlash(
                      added === 0
                        ? t('app.flash.importedNone')
                        : tp('app.flash.imported', added),
                    )
                    onClose()
                  }}
                >
                  {t('app.settings.merge')}
                </Button>
                <Button
                  variant="destructive"
                  strong
                  onClick={() => {
                    store.replaceRaces(pending.races)
                    setPending({ state: 'idle' })
                    onFlash(
                      tp('app.flash.replaced', pending.races.length),
                    )
                    onClose()
                  }}
                >
                  {t('app.settings.replace')}
                </Button>
              </div>
            </div>
          ) : pending.state === 'error' ? (
            <div className="confirm" role="alert">
              <p className="confirm__title t-danger">
                {t('app.import.errorTitle')}
              </p>
              <p className="confirm__body">{t(pending.message)}</p>
              <div className="confirm__actions">
                <Button onClick={openPicker}>{t('app.import.retry')}</Button>
              </div>
            </div>
          ) : (
            <ActionRow
              name={t('app.settings.import')}
              value={t('app.settings.importValue')}
              onClick={openPicker}
            />
          )}

          {askErase ? (
            <Confirm
              title={tp('app.settings.eraseAsk', count)}
              body={t('app.settings.eraseBody')}
            >
              <Button variant="quiet" onClick={() => setAskErase(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                strong
                onClick={() => {
                  store.eraseAll()
                  setAskErase(false)
                  onFlash(t('app.flash.erased'))
                  onClose()
                }}
              >
                {t('app.settings.eraseConfirm')}
              </Button>
            </Confirm>
          ) : (
            <ActionRow
              danger
              name={t('app.settings.erase')}
              value={tp('app.settings.eraseValue', count)}
              onClick={() => {
                setPending({ state: 'idle' })
                setAskErase(true)
              }}
            />
          )}

          <p className="settings__note">
            {store.storageAvailable
              ? tp('app.settings.storageNote', count)
              : t('app.settings.storageUnavailable')}
          </p>
        </section>

        <section>
          <div className="section-label">{t('app.settings.about')}</div>
          <LinkRow
            to="/about"
            name={t('app.settings.aboutApp')}
            value={t('app.settings.aboutValue')}
          />
          <LinkRow
            to="/changelog"
            name={t('app.settings.changelog')}
            value={t('app.settings.changelogValue')}
          />
          <StaticRow name={t('app.settings.version')} value={APP_VERSION} />
          <LinkRow
            to="/legal/terms"
            name={t('app.settings.legal')}
            value={t('app.settings.read')}
          />
          <LinkRow
            external
            to={LICENCE_URL}
            name={t('app.settings.licence')}
            value="AGPL-3.0"
          />
          {/* L'AGPL demande qu'une application offre son code source depuis
              son interface : c'est ici que l'utilisateur le trouve. */}
          <LinkRow
            external
            to={REPO}
            name={t('app.settings.source')}
            value={t('app.settings.sourceValue')}
          />
        </section>
      </div>
    </Sheet>
  )
}
