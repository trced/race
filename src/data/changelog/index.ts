export type { ChangelogVersion, ChangelogItem, ChangeType } from './types.ts'
export { changelogVersions } from './data.ts'

import { changelogVersions } from './data.ts'
import type { ChangelogVersion } from './types.ts'

export function getLatestVersion(): ChangelogVersion | undefined {
  return changelogVersions[0]
}

export function getLatestVersionString(): string {
  return changelogVersions[0]?.version ?? '0.0.0'
}
