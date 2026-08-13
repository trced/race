/** Bumper package.json et oublier le journal des versions, ou l'inverse :
 *  les deux se lisent dans l'interface, rien ne les confrontait. */

import { describe, expect, it } from 'vitest'
import { changelogVersions, getLatestVersionString } from './index.ts'
import { parseISODate } from '../../lib/format.ts'
import { APP_VERSION } from '../../lib/version.ts'

describe('journal des versions', () => {
  it('publie la version qui est réellement livrée', () => {
    expect(getLatestVersionString()).toBe(APP_VERSION)
  })

  it('date chaque version, et de la plus récente à la plus ancienne', () => {
    const dates = changelogVersions.map((entry) => entry.date)
    for (const date of dates) {
      expect(parseISODate(date), date).not.toBeNull()
    }
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('ne laisse aucune version sans changement, ni sans traduction', () => {
    for (const entry of changelogVersions) {
      const items = Object.values(entry.changes).flat()
      expect(items.length, entry.version).toBeGreaterThan(0)
      for (const item of items) {
        expect(item.text.trim(), entry.version).not.toBe('')
        expect(item.textEn.trim(), entry.version).not.toBe('')
      }
    }
  })
})
