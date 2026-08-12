/** Double de `virtual:pwa-register/react`.
 *
 *  Le module n'existe qu'au build : sans ce remplaçant, un test qui monte
 *  `UpdatePrompt` échoue à l'import, avant même de rendre quoi que ce soit.
 *  L'alias est posé dans `vitest.config.ts`.
 *
 *  Il imite le vrai sur le seul point qui compte ici : l'enregistrement a
 *  lieu une fois, au premier rendu, et pas à chaque passage. */

import { useState } from 'react'

export interface RegisterOptions {
  onRegisteredSW?: (
    url: string,
    registration: ServiceWorkerRegistration | undefined,
  ) => void
}

/** Ce que le test pilote, et ce qu'il observe. */
export const registerState: {
  needRefresh: boolean
  setNeedRefresh: (value: boolean) => void
  updateServiceWorker: () => Promise<void>
  registration: ServiceWorkerRegistration | undefined
} = {
  needRefresh: false,
  setNeedRefresh: () => {},
  updateServiceWorker: () => Promise.resolve(),
  registration: undefined,
}

export function useRegisterSW(options: RegisterOptions = {}) {
  useState(() => {
    options.onRegisteredSW?.('/sw.js', registerState.registration)
    return null
  })

  return {
    needRefresh: [registerState.needRefresh, registerState.setNeedRefresh] as [
      boolean,
      (value: boolean) => void,
    ],
    offlineReady: [false, () => {}] as [boolean, (value: boolean) => void],
    updateServiceWorker: registerState.updateServiceWorker,
  }
}
