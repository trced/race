/** Le bandeau de mise à jour, et surtout ce qu'il ne fait pas : rien tant
 *  qu'aucune version n'attend, et rien de plus que ce qu'on lui demande. */

import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../i18n/index.tsx'
import { registerState } from '../test/pwaRegister.ts'
import { UpdatePrompt } from './UpdatePrompt.tsx'

function renderPrompt() {
  return render(
    <I18nProvider lang="fr">
      <UpdatePrompt />
    </I18nProvider>,
  )
}

beforeEach(() => {
  // Un test pose un `serviceWorker` sur `navigator` ; sans ce ménage, les
  // autres ne verraient plus le navigateur qui n'en a pas.
  Reflect.deleteProperty(navigator, 'serviceWorker')
  registerState.needRefresh = false
  registerState.setNeedRefresh = vi.fn()
  registerState.updateServiceWorker = vi.fn(() => Promise.resolve())
  registerState.registration = undefined
})

describe('UpdatePrompt', () => {
  it('ne montre rien tant qu’aucune version n’attend', () => {
    renderPrompt()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('annonce la version en attente sans rien décider', () => {
    registerState.needRefresh = true
    renderPrompt()

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.getByText('Une nouvelle version est prête.')).toBeTruthy()
    // Le rechargement n'a pas eu lieu de lui-même : c'est tout l'intérêt du
    // mode « prompt » sur des données qui ne vivent que dans le navigateur.
    expect(registerState.updateServiceWorker).not.toHaveBeenCalled()
  })

  it('donne la main au worker en attente quand on le demande', async () => {
    registerState.needRefresh = true
    renderPrompt()

    await userEvent.click(screen.getByRole('button', { name: 'recharger' }))
    expect(registerState.updateServiceWorker).toHaveBeenCalled()
  })

  it('recharge de lui-même quand le contrôleur change', async () => {
    // Sur la page qui a installé le tout premier worker, le module
    // d'enregistrement ne recharge pas : il n'y voit pas une mise à jour. Sans
    // ce filet, le bandeau resterait affiché sur l'ancienne version.
    //
    // jsdom n'a pas de `serviceWorker` : les autres cas passent par
    // l'optionnel du composant, celui-ci a besoin de l'objet.
    const listen = vi.fn()
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { addEventListener: listen },
      configurable: true,
    })
    registerState.needRefresh = true
    renderPrompt()

    // Rien n'est armé tant qu'on n'a pas répondu : `clientsClaim` change de
    // contrôleur à la première visite, et recharger là tournerait en boucle.
    expect(listen).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'recharger' }))
    expect(listen).toHaveBeenCalledWith(
      'controllerchange',
      expect.any(Function),
      { once: true },
    )
  })

  it('range le bandeau sans rien activer', async () => {
    registerState.needRefresh = true
    renderPrompt()

    await userEvent.click(screen.getByRole('button', { name: 'fermer' }))
    expect(registerState.setNeedRefresh).toHaveBeenCalledWith(false)
    // Fermer n'est pas activer plus tard : l'ancienne version continue de
    // tourner, la nouvelle reste en attente.
    expect(registerState.updateServiceWorker).not.toHaveBeenCalled()
  })

  it('redemande le worker au retour sur l’application', () => {
    const update = vi.fn(() => Promise.resolve())
    registerState.registration = {
      installing: null,
      update,
    } as unknown as ServiceWorkerRegistration

    renderPrompt()
    document.dispatchEvent(new Event('visibilitychange'))

    // Sans cette relance, une application installée reste indéfiniment sur la
    // version avec laquelle elle a été ouverte : c'est le défaut que tout
    // ceci corrige.
    expect(update).toHaveBeenCalled()
  })
})
