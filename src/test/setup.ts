/** Node 26 expose un `localStorage` global indéfini (il attend l'option
 *  --localstorage-file), qui masque celui de jsdom. Les tests réinstallent
 *  une implémentation en mémoire — le code de production, lui, lit
 *  `window.localStorage` comme dans un navigateur. */

import { beforeEach } from 'vitest'

class MemoryStorage implements Storage {
  #items = new Map<string, string>()

  get length(): number {
    return this.#items.size
  }

  clear(): void {
    this.#items.clear()
  }

  getItem(key: string): string | null {
    return this.#items.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.#items.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.#items.delete(key)
  }

  setItem(key: string, value: string): void {
    this.#items.set(key, String(value))
  }
}

if (typeof window !== 'undefined' && !window.localStorage) {
  const store = new MemoryStorage()
  Object.defineProperty(window, 'localStorage', {
    value: store,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'localStorage', {
    value: store,
    configurable: true,
  })
}

beforeEach(() => {
  window.localStorage.clear()
})
