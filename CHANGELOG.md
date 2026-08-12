# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-11

### Added

- The app: three views over a race logbook — List to review everything, Year for density, Month for detail. One race per line, a dot when it took place, a vertical line when it spans several days
- Manual entry in four required fields — name, date, distance, duration — and three optional ones: climb, place, notes. The official distance fills itself in when the type is picked, and is never overwritten once edited
- Free search across name, place, type, notes and date, a filter by type and three sorts — newest first, oldest first, longest first
- Records view: best time per official distance with the gap to the second, the longest race, the one that climbs the most, and the totals. Categories with no race keep a dash rather than disappearing
- Settings: light, dark or system theme; French, English or system language; kilometres or miles; pace shown or hidden; default view. Each row cycles its values on click
- Export and import of the race.json file, with a choice between merging and replacing, and a full erase behind an explicit confirmation. A malformed race is dropped on its own rather than failing the whole import
- Installable, offline-capable PWA: everything is precached on download, and there is no network request in use
- Presentation site in French and English: home page with the real app embedded, about page, terms of use, privacy, legal notice and changelog
- Example mode reachable from the overview: the app filled with a set of ten races, writing nothing to the device
- The "famille ." 1.1.0 design system implemented as CSS tokens: colour, typography, space, shape, motion, and ten documented components
- Keyboard navigation throughout: arrows change period, `T` returns to today, `Escape` closes any sheet, and focus is trapped in dialogs and restored on close
- Unit tests over the pure layer — formatting, validation, calendar building, records, file import/merge — and end-to-end tests of the real user paths
