# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-08-13

### Added

- Curves view: one race type plotted over time, one point per race. Official distances (5k, 10k, half, marathon) are plotted as finish time; formats with no fixed distance — trail, ultra, other — are plotted as pace, the only figure that stays comparable when every race has its own length. A single control: the type, listing only the types actually in the logbook
- The axis is not flipped. A faster race sits lower, and the chart says so in words rather than miming it. Every plotted race is listed under the chart, which is also how the series is read by keyboard and screen reader, and how a race is opened
- Curves is a fourth destination, always within reach: in the tab bar from tablet width up, in the phone footer below it

### Changed

- The phone footer names its destinations exactly as the tab bar does — `année`, `records`, `courbes` — instead of `voir par année`. A destination no longer changes name with the width of the screen
- The chart library is fetched only when the Curves view is opened, so the list, the year, the records and the presentation page carry none of its weight. It is precached like the rest: offline is unaffected

### Fixed

- Focusing a field on a phone no longer zooms the page. Field text now has a floor of 16 px under a coarse pointer — below that, mobile Safari zooms in and never zooms back out. Nothing changes with a mouse, and pinch-to-zoom stays available: the viewport is not locked

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
