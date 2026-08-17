# Security policy

## Reporting a vulnerability

Do not open a public issue.

Report privately through [GitHub's advisory form](https://github.com/trced/race/security/advisories/new), or by email to <contact@race.app>.

Please include what you found, how to reproduce it, and what an attacker would gain. A proof of concept helps; a video is rarely needed.

You will get an acknowledgement within seven days and an assessment within thirty. If the report is valid you will be credited in the release notes, unless you would rather not be.

## What the attack surface actually is

race. has no server, no account, no network request in use, and no third-party runtime dependency beyond React and its router. There is nothing to escalate into and no other user's data to reach. That rules out most of what a security policy usually covers, and leaves a short list of things that are genuinely worth reporting:

- **Imported files.** `race.json` is parsed from a file the user chooses. Anything that turns a crafted file into script execution, prototype pollution, or corruption of an existing logbook is in scope.
- **Stored content rendered back.** Race names, places and notes are user text. Anything that gets them interpreted rather than displayed is in scope.
- **The service worker and its precache.** Cache poisoning, a stale asset that cannot be evicted, or a scope wider than the app is in scope.
- **Data leaving the device.** The app is meant to make zero network requests after install. Any request it makes on its own is a bug, and a serious one.
- **Dependencies.** A known vulnerability in a shipped dependency is in scope even if race. does not reach the affected code path.

## Not in scope

- Anything requiring physical access to an unlocked device. Local storage is readable by whoever holds the browser, by design — this is a local-first app.
- Clearing browser storage destroying data. That is documented behaviour; Settings → export exists for it.
- Reports from automated scanners with no demonstrated impact.
- The presentation site's lack of a login, rate limit or CSRF token. It has no server and no forms that submit anywhere.

## Supported versions

The project is pre-1.0. Only the latest release receives fixes; there are no maintenance branches.

| Version | Supported |
|---|---|
| 0.1.x | yes |
| < 0.1 | no |
