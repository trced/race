/** English dictionary — mirrors fr.ts key for key.
 *  The Record type below fails to compile on a missing or extra key. */

import type { MessageKey } from './fr.ts'

export const en: Record<MessageKey, string> = {
  // ————— common —————
  'common.brand': 'race.',
  'common.tagline': 'one thing. done well.',
  'common.close': 'close',
  'common.cancel': 'cancel',
  'common.skipToContent': 'skip to content',

  // ————— app · navigation —————
  'app.nav.breadcrumb': 'Breadcrumb',
  'app.nav.home': 'back to the app home',
  'app.nav.settings': 'settings',
  'app.nav.back': '‹ {label}',
  'app.nav.views': 'Views',
  'app.nav.tab.races': 'races',
  'app.nav.tab.year': 'year',
  'app.nav.tab.records': 'records',
  'app.nav.tab.curves': 'curves',
  'app.nav.add': '+ add',
  'app.nav.site': 'site',

  // ————— app · example mode —————
  'app.demo.label': 'example',
  'app.demo.note': 'nothing is saved on this device',
  'app.demo.leave': 'open my logbook',

  // ————— app · list —————
  'app.list.title': 'races',
  'app.list.searchLabel': 'Search a race',
  'app.list.searchPlaceholder': 'name, place, year',
  'app.list.clearSearch': 'Clear search',
  'app.list.filterLabel': 'Filter by type',
  'app.list.allTypes': 'all types',
  'app.list.count.one': '{n} race',
  'app.list.count.other': '{n} races',
  'app.list.countFiltered': '{n} of {total}',
  'app.list.notes': 'Notes: {notes}',
  'app.list.sort.dateDesc': 'date ↓',
  'app.list.sort.dateAsc': 'date ↑',
  'app.list.sort.distanceDesc': 'distance ↓',
  'app.list.sortName.dateDesc': 'newest first',
  'app.list.sortName.dateAsc': 'oldest first',
  'app.list.sortName.distanceDesc': 'longest first',
  'app.list.sortAria': 'sort: {value}, change',

  // ————— app · empty and no results —————
  'app.empty.title': 'No race recorded.',
  'app.empty.body': 'Start with the one you remember best.',
  'app.empty.action': '+ add a race',
  'app.empty.note': 'Already have a race.json file? Settings → import.',
  'app.noresults.title': 'No race matches.',
  'app.noresults.body': 'Try another word, or go back to every race.',
  'app.noresults.action': 'clear the filters',

  // ————— app · period —————
  'app.period.today': 'today',
  'app.period.backToToday': 'back to today',
  'app.period.hintYear': 'back to {year}',
  'app.period.hintMonth': 'back to {month} {year}',
  'app.period.prevYear': 'Previous year',
  'app.period.nextYear': 'Next year',
  'app.period.prevMonth': 'Previous month',
  'app.period.nextMonth': 'Next month',

  // ————— app · year view —————
  'app.year.legend': 'Key: ● N = N races that month · · = no race.',
  'app.year.monthAria.one': '{month}: {n} race',
  'app.year.monthAria.other': '{month}: {n} races',
  'app.year.monthAria.none': '{month}: no race',
  'app.year.marker.none': '·',

  // ————— app · month view —————
  'app.month.none': '—',
  'app.month.continued': '{name} — continued',
  'app.month.gap.one': '{n} day without a race',
  'app.month.gap.other': '{n} days without a race',

  // ————— app · records —————
  'app.records.title': 'records',
  'app.records.subtitle': 'best time per distance',
  'app.records.cat.5k': '5 km',
  'app.records.cat.10k': '10 km',
  'app.records.cat.semi': 'Half marathon',
  'app.records.cat.marathon': 'Marathon',
  'app.records.none': 'no race at this distance',
  'app.records.count.one': '{n} race',
  'app.records.count.other': '{n} races',
  'app.records.gap': '−{gap} on the 2nd',
  'app.records.outOfFormat': 'out of format',
  'app.records.longest': 'the longest',
  'app.records.steepest': 'the most climb',
  'app.records.total': 'total',
  'app.records.totalRaces': 'races',
  'app.records.totalDistance': 'distance',
  'app.records.totalElevation': 'climb',
  'app.records.empty': '—',

  // ————— app · curves view —————
  'app.curves.title': 'curves',
  'app.curves.subtitle': 'one race type over time',
  'app.curves.selectLabel': 'Race type',
  'app.curves.axis.time': 'finish time',
  'app.curves.axis.pace': 'pace (min/{unit})',
  'app.curves.legend.series': 'series',
  'app.curves.legend.vertical': 'vertical axis',
  'app.curves.legend.horizontal': 'horizontal axis',
  'app.curves.legend.date': 'race date',
  'app.curves.count.one': '{n} race',
  'app.curves.count.other': '{n} races',
  'app.curves.span': 'from {first} to {last}',
  'app.curves.reading.time': 'the lower the curve, the faster the race',
  'app.curves.reading.pace': 'the lower the curve, the faster the kilometres',
  'app.curves.chartAria':
    '{type}: {n} races, {axis} on the vertical axis, date on the horizontal one. Each race is listed under the chart.',
  'app.curves.loading': 'loading the chart…',
  'app.curves.error.title': 'The chart could not be loaded.',
  'app.curves.error.body':
    'The rest of the logbook is untouched. Reload the page to try again.',
  'app.curves.noPoints':
    'No race of this type can be placed: it takes a readable date and duration.',
  'app.curves.empty.title': 'Nothing to plot yet.',
  'app.curves.empty.body':
    'A curve needs at least one race. Write one down and its type will show up here.',

  // ————— app · race detail —————
  'app.detail.label': 'Race detail',
  'app.detail.distance': 'distance',
  'app.detail.elevation': 'climb',
  'app.detail.date': 'date',
  'app.detail.place': 'place · type',
  'app.detail.placeType': 'type',
  'app.detail.notes': 'notes',
  'app.detail.noNotes': 'no notes',
  'app.detail.edit': 'edit',
  'app.detail.delete': 'delete',
  'app.detail.none': '—',

  // ————— app · deletion —————
  'app.delete.title': 'Delete “{name}”?',
  'app.delete.body': 'Permanent, and on this device only.',
  'app.delete.confirm': 'delete permanently',

  // ————— app · edit —————
  'app.edit.newTitle': 'new race',
  'app.edit.editTitle': 'edit race',
  'app.edit.saveNew': 'add',
  'app.edit.save': 'save',
  'app.edit.requiredLegend': '* required field',
  'app.edit.name': 'Name',
  'app.edit.namePlaceholder': 'Paris Marathon',
  'app.edit.type': 'Type',
  'app.edit.date': 'Date',
  'app.edit.distance': 'Distance ({unit})',
  'app.edit.duration': 'Duration',
  'app.edit.durationHint': 'digits are enough: 4500 gives 45:00',
  'app.edit.durationPlaceholder': '3:45:00',
  'app.edit.elevation': 'Climb ({unit})',
  'app.edit.location': 'Place',
  'app.edit.notes': 'Notes',
  'app.edit.notesPlaceholder': "what you'll remember in ten years",
  'app.edit.distHintStandard': 'official distance: {distance}',
  'app.edit.distHintFree': 'distance covered',
  'app.edit.error.name': 'A name is needed to find it again.',
  'app.edit.error.dateFormat': 'Date expected as YYYY-MM-DD.',
  'app.edit.error.dateUnreal': 'That date does not exist.',
  'app.edit.error.distance': 'Distance greater than 0.',
  'app.edit.error.duration': 'Expected format: h:mm:ss or mm:ss.',

  // ————— app · race types —————
  'app.type.5k': '5k',
  'app.type.10k': '10k',
  'app.type.semi': 'Half',
  'app.type.marathon': 'Marathon',
  'app.type.trail': 'Trail',
  'app.type.ultra': 'Ultra',
  'app.type.other': 'Other',

  // ————— app · settings —————
  'app.settings.title': 'settings',
  'app.settings.display': 'display',
  'app.settings.theme': 'theme',
  'app.settings.theme.system': 'system',
  'app.settings.theme.light': 'light',
  'app.settings.theme.dark': 'dark',
  'app.settings.lang': 'language',
  'app.settings.lang.system': 'system',
  'app.settings.lang.fr': 'français',
  'app.settings.lang.en': 'english',
  'app.settings.unit': 'unit',
  'app.settings.unit.km': 'kilometres',
  'app.settings.unit.mi': 'miles',
  'app.settings.pace': 'pace',
  'app.settings.pace.shown': 'shown',
  'app.settings.pace.hidden': 'hidden',
  'app.settings.defaultView': 'default view',
  'app.settings.view.list': 'list',
  'app.settings.view.year': 'year',
  'app.settings.view.month': 'month',
  'app.settings.cycleAria': '{name}: {value}, change',
  'app.settings.displayNote':
    'Each row cycles through its values on click; the change applies at once.',
  'app.settings.data': 'data',
  'app.settings.export': 'export',
  'app.settings.exportValue': 'race.json',
  'app.settings.import': 'import',
  'app.settings.importValue': 'choose a file',
  'app.settings.importFound.one': '{file} — {n} race',
  'app.settings.importFound.other': '{file} — {n} races',
  'app.settings.importExplain':
    'Merging adds the races you are missing and keeps your own. Replacing erases the {n} races on this device.',
  'app.settings.importExplainEmpty':
    'No race on this device: both options come to the same thing.',
  'app.settings.merge': 'merge',
  'app.settings.replace': 'replace',
  'app.settings.erase': 'erase everything',
  'app.settings.eraseValue.one': '{n} race',
  'app.settings.eraseValue.other': '{n} races',
  'app.settings.eraseAsk.one': 'Erase the race on this device?',
  'app.settings.eraseAsk.other': 'Erase the {n} races on this device?',
  'app.settings.eraseBody':
    'Permanent. Export first if you want to keep them.',
  'app.settings.eraseConfirm': 'erase permanently',
  'app.settings.storageNote.one':
    '{n} race on this device. No account, no network.',
  'app.settings.storageNote.other':
    '{n} races on this device. No account, no network.',
  'app.settings.storageUnavailable':
    'This browser’s storage is unavailable: nothing will survive closing the tab. Export before you leave.',
  'app.settings.about': 'about',
  'app.settings.aboutApp': 'about race.',
  'app.settings.aboutValue': 'why this project',
  'app.settings.version': 'version',
  'app.settings.changelog': 'changelog',
  'app.settings.changelogValue': 'what changed',
  'app.settings.source': 'source code',
  'app.settings.sourceValue': 'github',
  'app.settings.licence': 'licence',
  'app.settings.legal': 'terms · privacy',
  'app.settings.read': 'read',

  // ————— app · status messages —————
  'app.flash.exported.one': 'race.json exported — {n} race',
  'app.flash.exported.other': 'race.json exported — {n} races',
  'app.flash.imported.one': '{n} race added',
  'app.flash.imported.other': '{n} races added',
  'app.flash.importedNone': 'no race to add',
  'app.flash.replaced.one': 'data replaced — {n} race',
  'app.flash.replaced.other': 'data replaced — {n} races',
  'app.flash.erased': 'every race has been erased',
  'app.flash.added': '“{name}” added',
  'app.flash.saved': '“{name}” saved',
  'app.flash.deleted': '“{name}” deleted',

  // ————— app · import refused —————
  'app.import.errorTitle': 'This file cannot be imported.',
  'app.import.errorUnreadable': 'The file is not readable JSON.',
  'app.import.errorSchema': 'The file format is not the expected one.',
  'app.import.errorVersion':
    'The data version is not compatible with this application.',
  'app.import.errorEmpty': 'The file holds no readable race.',
  'app.import.retry': 'choose another file',

  // ————— site · navigation —————
  'site.nav.home': 'overview',
  'site.nav.about': 'about',
  'site.nav.source': 'source code',
  'site.nav.app': 'open the app',
  'site.nav.back': '‹ overview',
  'site.nav.lang': 'FR',
  'site.nav.langAria': 'passer en français',

  // ————— site · overview —————
  'site.home.metaTitle': 'race. — all your races, one line each',
  'site.home.metaDescription':
    'race. answers a single question: what have I run? A race logbook that is local, offline and account-free.',
  'site.home.title': 'All your races. One line each.',
  'site.home.lede':
    'race. answers a single question: what have I run? No training plan, no leaderboard, no advice. You write the race down, and it is still readable in ten years.',
  'site.home.cta': 'add my first race',
  'site.home.demo': 'see an example',

  'site.home.fact.account': 'No account',
  'site.home.fact.accountNote': 'no email, no password',
  'site.home.fact.free': 'Free',
  'site.home.fact.freeNote': 'no paid tier',
  'site.home.fact.offline': 'Offline',
  'site.home.fact.offlineNote': 'works on a plane, in the mountains',
  'site.home.fact.device': 'On your device',
  'site.home.fact.deviceNote': 'nothing is sent anywhere',
  'site.home.fact.install': 'Installable',
  'site.home.fact.installNote': 'to the home screen, like an app',
  'site.home.fact.portable': 'Portable',
  'site.home.fact.portableNote': 'export from one device, import on the other',

  'site.home.concepts': 'three concepts',
  'site.home.concept.race': 'one race',
  'site.home.concept.raceBody':
    'The unit. A name, a date, a distance, a duration. Place, climb and notes stay optional.',
  'site.home.concept.views': 'three views',
  'site.home.concept.viewsBody':
    'List to review everything, Year for density, Month for detail. Each view fits on one page: no infinite scroll.',
  'site.home.concept.dot': 'the dot',
  'site.home.concept.dotBody':
    '● a race took place. · nothing that month. A vertical line carries a race across several days. That is the whole vocabulary.',

  'site.home.app': 'the app',
  'site.home.appCaption': 'the real app — click inside',
  'site.home.appBody':
    'The app, in working order. One race per line, the year as a marker, search above, a single action below.',
  'site.home.appHint.detail':
    'click a race to open its card, then “edit”',
  'site.home.appHint.year': '“year”, then a month for the calendar view',
  'site.home.appHint.records': '“records” for the best times per distance',
  'site.home.appHint.curves':
    '“curves” to follow one race type over time',
  'site.home.appHint.settings':
    '“settings” for the dark theme, miles, and export',

  'site.home.views': 'the three views',
  'site.home.view.list': 'list — default',
  'site.home.view.listNote': 'Every year, newest first.',
  'site.home.view.year': 'year',
  'site.home.view.yearNote': 'A year at a glance.',
  'site.home.view.month': 'month',
  'site.home.view.monthNote': 'The detail, day by day.',

  'site.home.notdo': 'what race. does not do',
  'site.home.notdo.gps': 'no GPS tracking, no watch to connect',
  'site.home.notdo.badges': 'no badges, no streak to keep alive',
  'site.home.notdo.social': 'no sharing, no leaderboard',
  'site.home.notdo.notifications': 'no notifications',
  'site.home.notdo.advice':
    'no prediction, no goal to hit: the curve shows what was run, it does not tell you what to do',

  'site.home.ready': 'Ready? The first race takes thirty seconds.',
  'site.home.readyNote': 'Light, dark or system theme · kilometres or miles',
  'site.home.start': 'get started',

  // ————— site · footer —————
  'site.footer.project': 'project',
  'site.footer.repo': 'repository',
  'site.footer.releases': 'releases',
  'site.footer.issues': 'report an issue',
  'site.footer.about': 'about',
  'site.footer.changelog': 'changelog',
  'site.footer.licence': 'licence',
  'site.footer.licenceName': 'AGPL-3.0-or-later',
  'site.footer.contribute': 'contribute',
  'site.footer.licenceNote':
    'Free and copyleft: any modified version that is distributed stays free.',
  'site.footer.legal': 'legal',
  'site.footer.terms': 'terms of use',
  'site.footer.privacy': 'privacy',
  'site.footer.notice': 'legal notice',
  'site.footer.contact': 'contact',
  'site.footer.version': 'version {version}',

  // ————— site · about —————
  'site.about.metaTitle': 'about — race.',
  'site.about.metaDescription':
    'Why race. exists, what it refuses to do, how it is built, and what becomes of your data.',
  'site.about.title': 'A race logbook, nothing more.',
  'site.about.lede':
    'Four fields, thirty seconds, and it is written down. No training, no ranking, no account: just what you have run, in a file kept on your device.',

  'site.about.why': 'why',
  'site.about.why.story': 'a race tells a story',
  'site.about.why.storyBody':
    'A time, a place, the leg that tightened at kilometre 32. Those details are a pleasure to re-read years later.',
  'site.about.why.last': 'built to last',
  'site.about.why.lastBody':
    'A simple file, on your device. Nothing depends on an online service.',
  'site.about.why.quiet': 'asking nothing of you',
  'site.about.why.quietBody':
    'No streak to keep, no reminder. Six months without running changes nothing.',

  'site.about.choices': 'the choices',
  'site.about.choicesIntro':
    'The rule of the project fits in four words: {rule}. Here is what it gives, on the build side:',
  'site.about.choicesRule': 'one thing, done well',
  'site.about.choice.manual': 'manual entry',
  'site.about.choice.manualNote': 'four fields, no sensor to authorise',
  'site.about.choice.views': 'three views',
  'site.about.choice.viewsNote': 'list, year, month — and nothing more',
  'site.about.choice.mono': 'monospace, no colour',
  'site.about.choice.monoNote': 'figures line up, the screen stays quiet',
  'site.about.choice.open': 'open source',
  'site.about.choice.openNote': 'AGPL-3.0-or-later, anyone can pick it up',

  'site.about.faq': 'frequently asked',
  'site.about.faq.data': 'Where is my data?',
  'site.about.faq.dataBody':
    'On your device, nowhere else. Clearing the browser storage erases it: remember to export.',
  'site.about.faq.devices': 'Moving from one device to another?',
  'site.about.faq.devicesBody':
    'Export race.json from the first, import it on the second — merging with what is already there, or replacing everything. Automatic sync would require an account: it is not planned.',
  'site.about.faq.watch': 'Import from a watch?',
  'site.about.faq.watchBody':
    'No direct connection for now. The JSON import brings a history over; otherwise a race takes thirty seconds to add.',
  'site.about.faq.price': 'What does it cost?',
  'site.about.faq.priceBody':
    'Nothing, and there is no paid tier: with no server, there is nothing to fund.',
  'site.about.faq.stops': 'And if the project stops?',
  'site.about.faq.stopsBody':
    'It keeps working, your data is at home with you, and the code stays public.',

  'site.about.contact': 'A criticism, an idea, a bug?',
  'site.about.contactNote': 'The repository is open, and so are its issues.',
  'site.about.report': 'report',
  'site.about.write': 'write',
  'site.about.legal': 'legal pages',

  // ————— site · changelog —————
  'site.changelog.metaTitle': 'changelog — race.',
  'site.changelog.metaDescription':
    'What changed in race., version by version.',
  'site.changelog.title': 'Changelog',
  'site.changelog.lede':
    'What changed, version by version. The same content as the repository’s CHANGELOG.md.',
  'site.changelog.type.added': 'added',
  'site.changelog.type.changed': 'changed',
  'site.changelog.type.fixed': 'fixed',
  'site.changelog.type.performance': 'performance',

  // ————— legal pages —————
  'legal.updated': 'updated {date}',
  'legal.terms.metaTitle': 'terms of use — race.',
  'legal.terms.metaDescription':
    'The terms of use for race.: free software provided as is, with no account and no remote service.',
  'legal.terms.title': 'Terms of use',
  'legal.terms.lede':
    'Short by construction: the app collects nothing, sells nothing and promises nothing beyond working.',
  'legal.terms.object': 'purpose',
  'legal.terms.objectBody':
    'race. is a personal race logbook that runs on your device. No account, no online service, no subscription.',
  'legal.terms.data': 'your data',
  'legal.terms.dataBody':
    'It stays in the browser’s local storage. Clearing it or uninstalling the app deletes it for good: export your file regularly.',
  'legal.terms.use': 'expected use',
  'legal.terms.useBody':
    'Personal, non-medical use. Distances, durations and paces are the ones you enter: neither official measurement nor training advice.',
  'legal.terms.licence': 'licence',
  'legal.terms.licenceBody':
    'Code published under AGPL-3.0-or-later. You may use, study, modify and redistribute it; any version distributed or exposed over a network must stay under the same licence, source code included.',
  'legal.terms.warranty': 'warranty',
  'legal.terms.warrantyBody':
    'Software provided “as is”, without warranty of any kind. The author cannot be held liable for data loss.',
  'legal.terms.changes': 'changes',
  'legal.terms.changesBody':
    'These terms may change with a major version. The date is at the top of the page, the history in the repository.',

  'legal.privacy.metaTitle': 'privacy — race.',
  'legal.privacy.metaDescription':
    'race. collects no data: no account, no server, no tracker, no analytics.',
  'legal.privacy.title': 'Privacy',
  'legal.privacy.lede':
    'race. collects no data. Nothing leaves your device.',
  'legal.privacy.sub':
    'There is no server to send anything to: that is a consequence of the architecture, not a commercial promise.',
  'legal.privacy.colSubject': 'subject',
  'legal.privacy.colAnswer': 'what race. does',
  'legal.privacy.account': 'user account',
  'legal.privacy.accountBody': 'none — no email, no password',
  'legal.privacy.storage': 'storage',
  'legal.privacy.storageBody':
    'local to the device, not encrypted by the app',
  'legal.privacy.analytics': 'analytics, telemetry',
  'legal.privacy.analyticsBody': 'none — no event measured',
  'legal.privacy.cookies': 'cookies, trackers',
  'legal.privacy.cookiesBody': 'none — hence no consent banner',
  'legal.privacy.third': 'third-party services',
  'legal.privacy.thirdBody': 'none — no remote font, map or script',
  'legal.privacy.network': 'network',
  'legal.privacy.networkBody':
    'on download of the app only, never in use',
  'legal.privacy.export': 'export',
  'legal.privacy.exportBody':
    'a JSON file that only you trigger and pass on',
  'legal.privacy.rights': 'your rights',
  'legal.privacy.rightsBody':
    'Access, rectification, erasure and portability are exercised directly in the app: view, edit, delete a race, erase everything, export the file. No request to address to anyone — nobody else holds your data.',

  'legal.notice.metaTitle': 'legal notice — race.',
  'legal.notice.metaDescription': 'Publisher, hosting and licence of race.',
  'legal.notice.title': 'Legal notice',
  'legal.notice.lede':
    'Publisher and host of the presentation site. Brackets mark the values to fill in before publication.',
  'legal.notice.publisher': 'publisher',
  'legal.notice.publisherBody': '[publisher name] — natural person',
  'legal.notice.status': 'status',
  'legal.notice.statusBody': 'personal project, no commercial activity',
  'legal.notice.director': 'director of publication',
  'legal.notice.directorBody': '[publisher name]',
  'legal.notice.contact': 'contact',
  'legal.notice.host': 'host',
  'legal.notice.hostBody': '[host name], [postal address], [country]',
  'legal.notice.ip': 'intellectual property',
  'legal.notice.ipBody':
    'code under AGPL-3.0-or-later; the “race.” name and visual identity are reserved',
  'legal.notice.mediation': 'mediation',
  'legal.notice.mediationBody':
    'no data processed, no service dispute; claims by email',

  // ————— update —————
  'update.available': 'A new version is ready.',
  'update.action': 'reload',

  // ————— not found —————
  'site.notfound.metaTitle': 'page not found — race.',
  'site.notfound.metaDescription': 'This address matches no page.',
  'site.notfound.title': 'This page does not exist.',
  'site.notfound.body':
    'The link may be old, or mistyped. Everything else works.',
  'site.notfound.action': 'back to the overview',
}
