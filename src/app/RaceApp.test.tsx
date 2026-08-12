/** Parcours réels de l'application, sur un stockage vide puis rempli. */

import { render, screen, waitFor, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { RaceApp } from './RaceApp.tsx'
import { I18nProvider } from '../i18n/index.tsx'
import { STORAGE_KEY } from '../lib/storage.ts'
import { SCHEMA_VERSION } from '../lib/types.ts'
import type { Race } from '../lib/types.ts'
import { DemoStoreProvider, StoreProvider } from '../state/store.tsx'

function seed(races: Race[]): void {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      data: { races },
      settings: { lang: 'fr' },
    }),
  )
}

function renderApp({ demo = false } = {}) {
  const tree = (
    <MemoryRouter>
      <StoreProvider>
        <I18nProvider lang="fr">
          {demo ? (
            <DemoStoreProvider>
              <RaceApp />
            </DemoStoreProvider>
          ) : (
            <RaceApp />
          )}
        </I18nProvider>
      </StoreProvider>
    </MemoryRouter>
  )
  return { user: userEvent.setup(), ...render(tree) }
}

const utmb: Race = {
  id: 'r1',
  type: 'ultra',
  name: 'UTMB',
  date: '2026-08-28',
  distance: 170,
  duration: '46:30:00',
  elevationGain: 10000,
  location: 'Chamonix',
  notes: 'Finisher !',
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('état vide', () => {
  it('invite à noter la première course', () => {
    renderApp()
    expect(screen.getByText('Aucune course enregistrée.')).toBeTruthy()
    // Ni recherche ni tri tant qu'il n'y a rien à réduire.
    expect(screen.queryByLabelText('Rechercher une course')).toBeNull()
  })
})

describe('ajouter une course', () => {
  it('la fait apparaître dans la liste et la conserve', async () => {
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: '+ ajouter' }))
    await user.type(screen.getByLabelText('Nom'), '10k de Lyon')
    await user.clear(screen.getByLabelText('Durée'))
    await user.type(screen.getByLabelText('Durée'), '45:00')
    await user.click(screen.getByRole('button', { name: 'ajouter' }))

    await waitFor(() => {
      expect(screen.getByText('10k de Lyon')).toBeTruthy()
    })
    // 10 km en 45:00 → 4:30 au kilomètre.
    expect(screen.getByText(/10 km – 45:00 \(4:30\/km\)/)).toBeTruthy()

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(stored.data.races).toHaveLength(1)
    expect(stored.data.races[0].name).toBe('10k de Lyon')
  })

  it('refuse d’enregistrer un formulaire incomplet', async () => {
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: '+ ajouter' }))
    await user.click(screen.getByRole('button', { name: 'ajouter' }))

    expect(
      screen.getByText('Un nom est nécessaire pour la retrouver.'),
    ).toBeTruthy()
    expect(screen.getByText('Format attendu : h:mm:ss ou mm:ss.')).toBeTruthy()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('liste', () => {
  beforeEach(() => {
    seed([
      utmb,
      {
        ...utmb,
        id: 'r2',
        name: '10k de Lyon',
        type: '10k',
        date: '2026-08-02',
        distance: 10,
        duration: '45:00',
        elevationGain: null,
        location: 'Lyon',
        notes: '',
      },
    ])
  })

  it('compte les courses et les réduit à la recherche', async () => {
    const { user } = renderApp()
    expect(screen.getByText('2 courses')).toBeTruthy()

    await user.type(screen.getByLabelText('Rechercher une course'), 'lyon')

    await waitFor(() => expect(screen.getByText('1 sur 2')).toBeTruthy())
    expect(screen.queryByText('UTMB')).toBeNull()
  })

  it('propose de sortir de l’impasse quand rien ne correspond', async () => {
    const { user } = renderApp()
    await user.type(screen.getByLabelText('Rechercher une course'), 'zurich')

    await waitFor(() =>
      expect(screen.getByText('Aucune course ne correspond.')).toBeTruthy(),
    )
    await user.click(screen.getByRole('button', { name: 'effacer les filtres' }))
    expect(screen.getByText('UTMB')).toBeTruthy()
  })

  it('ouvre la fiche puis supprime après confirmation', async () => {
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: /UTMB/ }))
    const sheet = screen.getByRole('dialog', { name: 'Détail de la course' })
    expect(within(sheet).getByText('46h30:00')).toBeTruthy()
    expect(within(sheet).getByText('Finisher !')).toBeTruthy()

    await user.click(within(sheet).getByRole('button', { name: 'supprimer' }))
    expect(screen.getByText('Supprimer « UTMB » ?')).toBeTruthy()
    await user.click(
      screen.getByRole('button', { name: 'supprimer définitivement' }),
    )

    await waitFor(() => expect(screen.queryByText('UTMB')).toBeNull())
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(stored.data.races).toHaveLength(1)
  })
})

describe('vues', () => {
  beforeEach(() => seed([utmb]))

  it('passe de la liste à l’année puis au mois', async () => {
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: 'voir par année' }))
    const august = screen.getByRole('button', { name: 'août : 1 course' })
    await user.click(august)

    // La vue Mois montre le départ et la continuation du lendemain.
    expect(screen.getByText('UTMB')).toBeTruthy()
    expect(screen.getByText('UTMB — suite')).toBeTruthy()

    // Le retour nomme l'année où il ramène, et il y ramène vraiment.
    const back = screen.getByRole('button', { name: '‹ 2026' })
    await user.click(back)
    expect(screen.getByRole('button', { name: 'août : 1 course' })).toBeTruthy()

    // Depuis l'année, un retour existe aussi vers la liste — il manquait.
    await user.click(screen.getByRole('button', { name: '‹ courses' }))
    expect(screen.getByLabelText('Rechercher une course')).toBeTruthy()
  })

  it('affiche le record et le total en vue Records', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'records' }))

    expect(screen.getByText('meilleur temps par distance')).toBeTruthy()
    // Les quatre catégories restent affichées : l'absence est une information.
    expect(screen.getAllByText('aucune course à cette distance')).toHaveLength(4)
    expect(screen.getByText('UTMB — 170 km')).toBeTruthy()
    expect(screen.getByText('UTMB — D+ 10 000 m')).toBeTruthy()
  })
})

describe('réglages', () => {
  beforeEach(() => seed([utmb]))

  it('bascule en miles et convertit l’affichage', async () => {
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: 'réglages' }))
    await user.click(
      screen.getByRole('button', { name: 'unité : kilomètres, changer' }),
    )
    await user.click(screen.getByRole('button', { name: 'fermer' }))

    await waitFor(() => expect(screen.getByText(/105,6 mi/)).toBeTruthy())
  })

  it('offre le code source depuis son interface, comme l’AGPL le demande', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'réglages' }))

    const source = screen.getByRole('link', { name: /code source/ })
    expect(source.getAttribute('href')).toBe('https://github.com/trced/race')
    // Le texte livré avec le programme, pas la page de la FSF : c'est la
    // copie qui accompagne ce logiciel-là qui fait foi.
    expect(
      screen.getByRole('link', { name: /licence/ }).getAttribute('href'),
    ).toBe('https://github.com/trced/race/blob/main/LICENSE')
  })

  it('efface tout après confirmation explicite', async () => {
    const { user } = renderApp()

    await user.click(screen.getByRole('button', { name: 'réglages' }))
    await user.click(screen.getByRole('button', { name: /tout effacer/ }))
    expect(
      screen.getByText('Effacer la course de cet appareil ?'),
    ).toBeTruthy()
    await user.click(
      screen.getByRole('button', { name: 'effacer définitivement' }),
    )

    await waitFor(() =>
      expect(screen.getByText('Aucune course enregistrée.')).toBeTruthy(),
    )
  })
})

describe('mode exemple', () => {
  it('montre le jeu d’exemple sans rien écrire sur l’appareil', async () => {
    const { user } = renderApp({ demo: true })

    expect(screen.getByText(/rien n'est enregistré/)).toBeTruthy()
    expect(screen.getByText('UTMB')).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /UTMB/ }))
    const sheet = screen.getByRole('dialog', { name: 'Détail de la course' })
    await user.click(within(sheet).getByRole('button', { name: 'supprimer' }))
    await user.click(
      screen.getByRole('button', { name: 'supprimer définitivement' }),
    )

    await waitFor(() => expect(screen.queryByText('UTMB')).toBeNull())
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(stored.data?.races ?? []).toHaveLength(0)
  })
})
