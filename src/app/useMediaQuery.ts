/** Une requête média lue depuis React. Sert à ne pas *monter* ce qui n'a pas
 *  sa place — un `display: none` garderait l'application incrustée vivante
 *  sur un téléphone, et le volet de droite dans un arbre qu'on ne voit pas. */

import { useCallback, useSyncExternalStore } from 'react'

/** Faux hors navigateur et partout où matchMedia n'existe pas : la mise en
 *  page étroite est la référence, la large en est l'extension. */
function matches(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(query).matches
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => matches(query),
    () => false,
  )
}
