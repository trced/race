import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  EXPORT_FILENAME,
  mergeRaces,
  parseFile,
  serializeFile,
  shareFile,
} from './io.ts'
import { SCHEMA_VERSION } from './types.ts'
import type { Race, RaceFile } from './types.ts'

const race = (patch: Partial<Race> & { name: string; date: string }): Race => ({
  id: patch.name,
  type: '10k',
  distance: 10,
  duration: '45:00',
  elevationGain: null,
  location: '',
  notes: '',
  ...patch,
})

const file = (races: Race[]) =>
  JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    data: { races },
    settings: {},
  })

describe('parseFile', () => {
  it('lit un fichier valide', () => {
    const result = parseFile(file([race({ name: 'UTMB', date: '2026-08-28' })]))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.file.data.races).toHaveLength(1)
  })

  it('refuse un JSON illisible', () => {
    expect(parseFile('{')).toMatchObject({ ok: false, reason: 'unreadable' })
  })

  it('refuse une autre version de schéma', () => {
    const raw = JSON.stringify({ schemaVersion: 2, data: { races: [] } })
    expect(parseFile(raw)).toMatchObject({ ok: false, reason: 'version' })
  })

  it('refuse une forme inattendue', () => {
    expect(parseFile('[]')).toMatchObject({ ok: false, reason: 'schema' })
    expect(
      parseFile(JSON.stringify({ schemaVersion: 1, data: {} })),
    ).toMatchObject({ ok: false, reason: 'schema' })
  })

  it('écarte une course cassée sans perdre les autres', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      data: {
        races: [
          { name: 'sans date', distance: 10 },
          { name: 'distance nulle', date: '2026-01-01', distance: 0 },
          { name: 'bonne', date: '2026-01-02', distance: 10, duration: '45:00' },
        ],
      },
    })
    const result = parseFile(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.file.data.races.map((r) => r.name)).toEqual(['bonne'])
    }
  })

  it('ramène un type inconnu à « other » et complète les manques', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      data: { races: [{ date: '2026-01-02', distance: 10, type: 'biathlon' }] },
    })
    const result = parseFile(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      const [first] = result.file.data.races
      expect(first?.type).toBe('other')
      expect(first?.name).toBe('2026-01-02')
      expect(first?.id).toBeTruthy()
    }
  })

  it('ne garde que les réglages reconnus', () => {
    const raw = JSON.stringify({
      schemaVersion: 1,
      data: { races: [] },
      settings: { theme: 'dark', unit: 'furlongs', inventé: true },
    })
    const result = parseFile(raw)
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.file.settings).toEqual({ theme: 'dark' })
  })

  it('fait l’aller-retour avec serializeFile', () => {
    const original = {
      schemaVersion: SCHEMA_VERSION,
      data: { races: [race({ name: 'UTMB', date: '2026-08-28' })] },
      settings: { theme: 'dark' as const },
    }
    const result = parseFile(serializeFile(original))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.file).toEqual(original)
  })
})

describe('mergeRaces', () => {
  const mine = [
    race({ name: 'UTMB', date: '2026-08-28' }),
    race({ name: '10k de Lyon', date: '2026-08-02' }),
  ]

  it('ajoute les absentes et garde les miennes', () => {
    const result = mergeRaces(mine, [
      race({ name: 'Semi de Turin', date: '2025-03-09' }),
    ])
    expect(result.added).toBe(1)
    expect(result.races).toHaveLength(3)
    expect(result.races.slice(0, 2)).toEqual(mine)
  })

  it('reconnaît la même course malgré un identifiant différent', () => {
    const result = mergeRaces(mine, [
      { ...race({ name: 'utmb', date: '2026-08-28' }), id: 'autre-appareil' },
    ])
    expect(result.added).toBe(0)
    expect(result.skipped).toBe(1)
    expect(result.races).toHaveLength(2)
  })

  it('ne duplique pas une course présente deux fois dans le fichier', () => {
    const twice = [
      race({ name: 'Corrida', date: '2025-12-20' }),
      race({ name: 'Corrida', date: '2025-12-20' }),
    ]
    expect(mergeRaces([], twice).races).toHaveLength(1)
  })
})

describe('shareFile', () => {
  const raceFile: RaceFile = {
    schemaVersion: SCHEMA_VERSION,
    data: { races: [race({ name: 'UTMB', date: '2026-08-28' })] },
    settings: {},
  }

  /** jsdom n'implémente pas les URL d'objet : le chemin téléchargement en a
   *  besoin, on le remplace par un compteur. */
  const stubDownload = (): { clicks: () => number } => {
    let clicks = 0
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: () => 'blob:race',
      revokeObjectURL: () => {},
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      clicks++
    })
    return { clicks: () => clicks }
  }

  const stubShare = (
    share: (data: ShareData) => Promise<void>,
    canShare = true,
  ): { shared: () => ShareData | null } => {
    let shared: ShareData | null = null
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: (data: ShareData) => {
        shared = data
        return share(data)
      },
    })
    Object.defineProperty(navigator, 'canShare', {
      configurable: true,
      value: () => canShare,
    })
    return { shared: () => shared }
  }

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    Reflect.deleteProperty(navigator, 'share')
    Reflect.deleteProperty(navigator, 'canShare')
  })

  it('passe le fichier au partage natif de l’appareil', async () => {
    const download = stubDownload()
    const native = stubShare(() => Promise.resolve())

    await expect(shareFile(raceFile)).resolves.toBe('shared')

    const files = native.shared()?.files
    expect(files).toHaveLength(1)
    expect(files?.[0]?.name).toBe(EXPORT_FILENAME)
    expect(files?.[0]?.type).toBe('application/json')
    expect(await files?.[0]?.text()).toBe(serializeFile(raceFile))
    // Partager suffit : rien ne tombe en plus dans les téléchargements.
    expect(download.clicks()).toBe(0)
  })

  it('télécharge quand l’appareil ne partage pas de fichier', async () => {
    const download = stubDownload()
    stubShare(() => Promise.resolve(), false)

    await expect(shareFile(raceFile)).resolves.toBe('downloaded')
    expect(download.clicks()).toBe(1)
  })

  it('télécharge quand le partage natif n’existe pas', async () => {
    const download = stubDownload()

    await expect(shareFile(raceFile)).resolves.toBe('downloaded')
    expect(download.clicks()).toBe(1)
  })

  it('ne télécharge rien quand l’utilisateur renonce', async () => {
    const download = stubDownload()
    stubShare(() => Promise.reject(new DOMException('annulé', 'AbortError')))

    await expect(shareFile(raceFile)).resolves.toBe('cancelled')
    expect(download.clicks()).toBe(0)
  })

  /** Une panne du partage n'est pas un refus : le fichier doit sortir
   *  quand même, par le chemin qui marche toujours. */
  it('retombe sur le téléchargement quand le partage échoue', async () => {
    const download = stubDownload()
    stubShare(() => Promise.reject(new Error('indisponible')))

    await expect(shareFile(raceFile)).resolves.toBe('downloaded')
    expect(download.clicks()).toBe(1)
  })
})
