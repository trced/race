/** Dictionnaire français — référence. en.ts en est le miroir typé :
 *  une clé manquante ou en trop échoue à la compilation.
 *  Convention de clé : domaine.composant.clé. */

export const fr = {
  // ————— commun —————
  'common.brand': 'race.',
  'common.tagline': 'une chose. bien faite.',
  'common.close': 'fermer',
  'common.cancel': 'annuler',
  'common.skipToContent': 'aller au contenu',

  // ————— application · navigation —————
  'app.nav.breadcrumb': "Fil d'Ariane",
  'app.nav.home': "revenir à l'accueil de l'application",
  'app.nav.settings': 'réglages',
  // Le retour nomme l'endroit où il ramène — « ‹ 2026 » plutôt que « retour ».
  'app.nav.back': '‹ {label}',
  // Destinations : mêmes libellés en barre haute et au pied du téléphone.
  // Une destination ne change pas de nom selon la taille de l'écran.
  'app.nav.views': 'Vues',
  'app.nav.tab.races': 'courses',
  'app.nav.tab.year': 'année',
  'app.nav.tab.records': 'records',
  'app.nav.tab.curves': 'courbes',
  'app.nav.add': '+ ajouter',
  'app.nav.site': 'site',

  // ————— application · mode exemple —————
  'app.demo.label': 'exemple',
  'app.demo.note': "rien n'est enregistré sur cet appareil",
  'app.demo.leave': "ouvrir mon journal",

  // ————— application · liste —————
  'app.list.title': 'courses',
  'app.list.searchLabel': 'Rechercher une course',
  'app.list.searchPlaceholder': 'nom, lieu, année',
  'app.list.clearSearch': 'Effacer la recherche',
  'app.list.filterLabel': 'Filtrer par type',
  'app.list.allTypes': 'tous les types',
  'app.list.count.one': '{n} course',
  'app.list.count.other': '{n} courses',
  'app.list.countFiltered': '{n} sur {total}',
  'app.list.notes': 'Notes : {notes}',
  'app.list.sort.dateDesc': 'date ↓',
  'app.list.sort.dateAsc': 'date ↑',
  'app.list.sort.distanceDesc': 'distance ↓',
  'app.list.sortName.dateDesc': 'date décroissante',
  'app.list.sortName.dateAsc': 'date croissante',
  'app.list.sortName.distanceDesc': 'distance décroissante',
  'app.list.sortAria': 'tri : {value}, changer',

  // ————— application · état vide et absence de résultat —————
  'app.empty.title': 'Aucune course enregistrée.',
  'app.empty.body': 'Commencez par celle dont vous vous souvenez le mieux.',
  'app.empty.action': '+ ajouter une course',
  'app.empty.note': 'Vous avez déjà un fichier race.json ? Réglages → importer.',
  'app.noresults.title': 'Aucune course ne correspond.',
  'app.noresults.body':
    'Essayez un autre mot, ou revenez à toutes les courses.',
  'app.noresults.action': 'effacer les filtres',

  // ————— application · période —————
  'app.period.today': "aujourd'hui",
  'app.period.backToToday': "revenir à aujourd'hui",
  'app.period.hintYear': 'revenir à {year}',
  'app.period.hintMonth': 'revenir à {month} {year}',
  'app.period.prevYear': 'Année précédente',
  'app.period.nextYear': 'Année suivante',
  'app.period.prevMonth': 'Mois précédent',
  'app.period.nextMonth': 'Mois suivant',

  // ————— application · vue année —————
  'app.year.legend':
    'Légende : ● N = N courses dans le mois · · = aucune course.',
  'app.year.monthAria.one': '{month} : {n} course',
  'app.year.monthAria.other': '{month} : {n} courses',
  'app.year.monthAria.none': '{month} : aucune course',
  'app.year.marker.none': '·',

  // ————— application · vue mois —————
  'app.month.none': '—',
  'app.month.continued': '{name} — suite',
  'app.month.gap.one': '{n} jour sans course',
  'app.month.gap.other': '{n} jours sans course',

  // ————— application · records —————
  'app.records.title': 'records',
  'app.records.subtitle': 'meilleur temps par distance',
  'app.records.cat.5k': '5 km',
  'app.records.cat.10k': '10 km',
  'app.records.cat.semi': 'Semi-marathon',
  'app.records.cat.marathon': 'Marathon',
  'app.records.none': 'aucune course à cette distance',
  'app.records.count.one': '{n} course',
  'app.records.count.other': '{n} courses',
  'app.records.gap': '−{gap} sur la 2e',
  'app.records.outOfFormat': 'hors format',
  'app.records.longest': 'la plus longue',
  'app.records.steepest': 'le plus de D+',
  'app.records.total': 'total',
  'app.records.totalRaces': 'courses',
  'app.records.totalDistance': 'distance',
  'app.records.totalElevation': 'dénivelé',
  'app.records.empty': '—',

  // ————— application · vue courbes —————
  'app.curves.title': 'courbes',
  'app.curves.subtitle': 'un type de course dans le temps',
  'app.curves.selectLabel': 'Type de course',
  'app.curves.axis.time': 'temps de course',
  'app.curves.axis.pace': 'allure (min/{unit})',
  'app.curves.legend.series': 'série',
  'app.curves.legend.vertical': 'axe vertical',
  'app.curves.legend.horizontal': 'axe horizontal',
  'app.curves.legend.date': 'date de la course',
  'app.curves.count.one': '{n} course',
  'app.curves.count.other': '{n} courses',
  'app.curves.span': 'de {first} à {last}',
  // L'axe n'est pas retourné : on dit le sens de lecture au lieu de le mimer.
  'app.curves.reading.time': 'plus la courbe descend, plus la course a été rapide',
  'app.curves.reading.pace':
    'plus la courbe descend, plus les kilomètres ont été rapides',
  'app.curves.chartAria':
    '{type} : {n} courses, {axis} en ordonnée, date en abscisse. Le détail de chaque course suit sous le graphique.',
  'app.curves.loading': 'chargement du tracé…',
  'app.curves.error.title': 'Le tracé n’a pas pu être chargé.',
  'app.curves.error.body':
    'Le reste du journal est intact. Rechargez la page pour réessayer.',
  'app.curves.noPoints':
    'Aucune course de ce type ne peut être placée : il y faut une date et une durée lisibles.',
  'app.curves.empty.title': 'Rien à tracer pour le moment.',
  'app.curves.empty.body':
    'Une courbe demande au moins une course. Notez-en une, et son type apparaîtra ici.',

  // ————— application · fiche de course —————
  'app.detail.label': 'Détail de la course',
  'app.detail.distance': 'distance',
  'app.detail.elevation': 'dénivelé',
  'app.detail.date': 'date',
  'app.detail.place': 'lieu · type',
  'app.detail.placeType': 'type',
  'app.detail.notes': 'notes',
  'app.detail.noNotes': 'aucune note',
  'app.detail.edit': 'modifier',
  'app.detail.delete': 'supprimer',
  'app.detail.none': '—',

  // ————— application · suppression —————
  'app.delete.title': 'Supprimer « {name} » ?',
  'app.delete.body': 'Action définitive, sur cet appareil uniquement.',
  'app.delete.confirm': 'supprimer définitivement',

  // ————— application · édition —————
  'app.edit.newTitle': 'nouvelle course',
  'app.edit.editTitle': 'modifier la course',
  'app.edit.saveNew': 'ajouter',
  'app.edit.save': 'enregistrer',
  'app.edit.requiredLegend': '* champ obligatoire',
  'app.edit.name': 'Nom',
  'app.edit.namePlaceholder': 'Marathon de Paris',
  'app.edit.type': 'Type',
  'app.edit.date': 'Date',
  'app.edit.distance': 'Distance ({unit})',
  'app.edit.duration': 'Durée',
  'app.edit.durationHint': 'les chiffres suffisent : 4500 donne 45:00',
  'app.edit.durationPlaceholder': '3:45:00',
  'app.edit.elevation': 'D+ ({unit})',
  'app.edit.location': 'Lieu',
  'app.edit.notes': 'Notes',
  'app.edit.notesPlaceholder': 'ce dont vous vous souviendrez dans dix ans',
  'app.edit.distHintStandard': 'distance officielle : {distance}',
  'app.edit.distHintFree': 'distance parcourue',
  'app.edit.error.name': 'Un nom est nécessaire pour la retrouver.',
  'app.edit.error.dateFormat': 'Date attendue au format AAAA-MM-JJ.',
  'app.edit.error.dateUnreal': "Cette date n'existe pas.",
  'app.edit.error.distance': 'Distance supérieure à 0.',
  'app.edit.error.duration': 'Format attendu : h:mm:ss ou mm:ss.',

  // ————— application · types de course —————
  'app.type.5k': '5k',
  'app.type.10k': '10k',
  'app.type.semi': 'Semi',
  'app.type.marathon': 'Marathon',
  'app.type.trail': 'Trail',
  'app.type.ultra': 'Ultra',
  'app.type.other': 'Autre',

  // ————— application · réglages —————
  'app.settings.title': 'réglages',
  'app.settings.display': 'affichage',
  'app.settings.theme': 'thème',
  'app.settings.theme.system': 'système',
  'app.settings.theme.light': 'clair',
  'app.settings.theme.dark': 'sombre',
  'app.settings.lang': 'langue',
  'app.settings.lang.system': 'système',
  'app.settings.lang.fr': 'français',
  'app.settings.lang.en': 'english',
  'app.settings.unit': 'unité',
  'app.settings.unit.km': 'kilomètres',
  'app.settings.unit.mi': 'miles',
  'app.settings.pace': 'allure',
  'app.settings.pace.shown': 'affichée',
  'app.settings.pace.hidden': 'masquée',
  'app.settings.defaultView': 'vue par défaut',
  'app.settings.view.list': 'liste',
  'app.settings.view.year': 'année',
  'app.settings.view.month': 'mois',
  'app.settings.cycleAria': '{name} : {value}, changer',
  'app.settings.displayNote':
    "Chaque ligne défile ses valeurs au clic ; le changement s'applique aussitôt.",
  'app.settings.data': 'données',
  'app.settings.export': 'exporter',
  'app.settings.exportValue': 'race.json',
  'app.settings.import': 'importer',
  'app.settings.importValue': 'choisir un fichier',
  'app.settings.importFound.one': '{file} — {n} course',
  'app.settings.importFound.other': '{file} — {n} courses',
  'app.settings.importExplain':
    'Fusionner ajoute les courses absentes et garde les vôtres. Remplacer efface les {n} courses de cet appareil.',
  'app.settings.importExplainEmpty':
    "Aucune course sur cet appareil : les deux options reviennent au même.",
  'app.settings.merge': 'fusionner',
  'app.settings.replace': 'remplacer',
  'app.settings.erase': 'tout effacer',
  'app.settings.eraseValue.one': '{n} course',
  'app.settings.eraseValue.other': '{n} courses',
  'app.settings.eraseAsk.one': 'Effacer la course de cet appareil ?',
  'app.settings.eraseAsk.other': 'Effacer les {n} courses de cet appareil ?',
  'app.settings.eraseBody':
    'Action définitive. Exportez d’abord si vous voulez les garder.',
  'app.settings.eraseConfirm': 'effacer définitivement',
  'app.settings.storageNote.one':
    '{n} course sur cet appareil. Aucun compte, aucun réseau.',
  'app.settings.storageNote.other':
    '{n} courses sur cet appareil. Aucun compte, aucun réseau.',
  'app.settings.storageUnavailable':
    "Le stockage de ce navigateur est indisponible : rien ne sera conservé après la fermeture. Exportez avant de partir.",
  'app.settings.about': 'à propos',
  'app.settings.aboutApp': 'à propos de race.',
  'app.settings.aboutValue': 'pourquoi ce projet',
  'app.settings.version': 'version',
  'app.settings.changelog': 'journal des changements',
  'app.settings.changelogValue': 'ce qui a changé',
  'app.settings.source': 'code source',
  'app.settings.sourceValue': 'dépôt GitHub',
  'app.settings.licence': 'licence',
  'app.settings.legal': 'conditions · confidentialité',
  'app.settings.read': 'lire',

  // ————— application · messages d'état —————
  'app.flash.exported.one': 'race.json exporté — {n} course',
  'app.flash.exported.other': 'race.json exporté — {n} courses',
  'app.flash.imported.one': '{n} course ajoutée',
  'app.flash.imported.other': '{n} courses ajoutées',
  'app.flash.importedNone': 'aucune course à ajouter',
  'app.flash.replaced.one': 'données remplacées — {n} course',
  'app.flash.replaced.other': 'données remplacées — {n} courses',
  'app.flash.erased': 'toutes les courses ont été effacées',
  'app.flash.added': '« {name} » ajoutée',
  'app.flash.saved': '« {name} » enregistrée',
  'app.flash.deleted': '« {name} » supprimée',

  // ————— application · import refusé —————
  'app.import.errorTitle': "Impossible d'importer ce fichier.",
  'app.import.errorUnreadable': "Le fichier n'est pas un JSON lisible.",
  'app.import.errorSchema': "Le format du fichier n'est pas celui attendu.",
  'app.import.errorVersion':
    "La version des données n'est pas compatible avec cette application.",
  'app.import.errorEmpty': 'Le fichier ne contient aucune course lisible.',
  'app.import.retry': 'choisir un autre fichier',

  // ————— site · navigation —————
  'site.nav.home': 'présentation',
  'site.nav.about': 'à propos',
  'site.nav.source': 'code source',
  'site.nav.app': "ouvrir l'application",
  'site.nav.back': '‹ présentation',
  'site.nav.lang': 'EN',
  'site.nav.langAria': 'switch to English',

  // ————— site · présentation —————
  'site.home.metaTitle': 'race. — toutes vos courses, une ligne chacune',
  'site.home.metaDescription':
    "race. répond à une seule question : qu'est-ce que j'ai couru ? Journal de courses local, hors ligne, sans compte.",
  'site.home.title': 'Toutes vos courses. Une ligne chacune.',
  'site.home.lede':
    "race. répond à une seule question : qu'est-ce que j'ai couru ? Pas de plan d'entraînement, pas de classement, aucun conseil. Vous notez la course, elle reste lisible dans dix ans.",
  'site.home.cta': 'ajouter ma première course',
  'site.home.demo': 'voir un exemple',

  'site.home.fact.account': 'Sans compte',
  'site.home.fact.accountNote': 'ni e-mail, ni mot de passe',
  'site.home.fact.free': 'Gratuit',
  'site.home.fact.freeNote': 'sans version payante',
  'site.home.fact.offline': 'Hors ligne',
  'site.home.fact.offlineNote': 'fonctionne en avion, en montagne',
  'site.home.fact.device': 'Sur votre appareil',
  'site.home.fact.deviceNote': "rien n'est envoyé nulle part",
  'site.home.fact.install': 'Installable',
  'site.home.fact.installNote': "sur l'écran d'accueil, comme une app",
  'site.home.fact.portable': 'Transférable',
  'site.home.fact.portableNote': "export d'un appareil, import sur l'autre",

  'site.home.concepts': 'trois concepts',
  'site.home.concept.race': 'une course',
  'site.home.concept.raceBody':
    "L'unité. Un nom, une date, une distance, une durée. Le lieu, le dénivelé et les notes restent facultatifs.",
  'site.home.concept.views': 'trois vues',
  'site.home.concept.viewsBody':
    'Liste pour tout revoir, Année pour la densité, Mois pour le détail. Chaque vue tient sur une page : aucun scroll infini.',
  'site.home.concept.dot': 'le point',
  'site.home.concept.dotBody':
    "● une course a eu lieu. · rien ce mois-là. Un trait vertical prolonge une course de plusieurs jours. C'est tout le vocabulaire.",

  'site.home.app': "l'application",
  'site.home.appCaption': 'application réelle — cliquez dedans',
  'site.home.appBody':
    "L'application, en état de marche. Une course par ligne, l'année en rappel, la recherche au-dessus, une seule action en bas.",
  'site.home.appHint.detail':
    'cliquez une course pour ouvrir sa fiche, puis « modifier »',
  'site.home.appHint.year': '« année » puis un mois pour la vue calendrier',
  'site.home.appHint.records':
    '« records » pour les meilleurs temps par distance',
  'site.home.appHint.curves':
    '« courbes » pour suivre un même type de course dans le temps',
  'site.home.appHint.settings':
    '« réglages » pour le thème sombre, les miles, l’export',

  'site.home.views': 'les trois vues',
  'site.home.view.list': 'liste — par défaut',
  'site.home.view.listNote': 'Toutes les années, date décroissante.',
  'site.home.view.year': 'année',
  'site.home.view.yearNote': "Une année tient en un coup d'œil.",
  'site.home.view.month': 'mois',
  'site.home.view.monthNote': 'Le détail, jour par jour.',

  'site.home.notdo': 'ce que race. ne fait pas',
  'site.home.notdo.gps': 'aucun suivi GPS, aucune montre à connecter',
  'site.home.notdo.badges': 'aucun badge, aucune série à ne pas rompre',
  'site.home.notdo.social': 'aucun partage, aucun classement',
  'site.home.notdo.notifications': 'aucune notification',
  // Depuis 0.1.1 il y a une courbe. Ce qu'une courbe traîne d'habitude
  // derrière elle, lui, est toujours refusé — et il faut le dire.
  'site.home.notdo.advice':
    'aucune prédiction, aucun objectif à tenir : la courbe montre ce qui a été couru, elle ne dit pas quoi faire',

  'site.home.ready': 'Prêt ? La première course prend trente secondes.',
  'site.home.readyNote':
    'Thème clair, sombre ou système · kilomètres ou miles',
  'site.home.start': 'commencer',

  // ————— site · pied de page —————
  'site.footer.project': 'projet',
  'site.footer.repo': 'dépôt GitHub',
  'site.footer.releases': 'versions',
  'site.footer.issues': 'signaler un bug',
  'site.footer.about': 'à propos',
  'site.footer.changelog': 'journal des changements',
  'site.footer.licence': 'licence',
  'site.footer.licenceName': 'AGPL-3.0',
  'site.footer.contribute': 'contribuer',
  'site.footer.licenceNote':
    'Libre et copyleft : toute version modifiée et distribuée reste libre.',
  'site.footer.legal': 'légal',
  'site.footer.terms': "conditions d'utilisation",
  'site.footer.privacy': 'confidentialité',
  'site.footer.notice': 'mentions légales',
  'site.footer.contact': 'contact',
  'site.footer.version': 'race. {version} — une chose. bien faite.',

  // ————— site · à propos —————
  'site.about.metaTitle': 'race. — à propos',
  'site.about.metaDescription':
    "Pourquoi race. existe, ce qu'elle refuse de faire, comment elle est faite, ce qu'il advient de vos données.",
  'site.about.title': 'Un carnet de courses, rien de plus.',
  'site.about.lede':
    "Quatre champs, trente secondes, et c'est noté. Pas d'entraînement, pas de classement, pas de compte : juste ce que vous avez couru, dans un fichier gardé sur votre appareil.",

  'site.about.why': 'pourquoi',
  'site.about.why.story': 'une course se raconte',
  'site.about.why.storyBody':
    'Un temps, un lieu, la jambe qui tire au 32e. Ces détails-là se relisent avec plaisir des années après.',
  'site.about.why.last': 'pensé pour durer',
  'site.about.why.lastBody':
    "Un fichier simple, sur votre appareil. Rien ne dépend d'un service en ligne.",
  'site.about.why.quiet': 'sans rien vous demander',
  'site.about.why.quietBody':
    'Pas de série à entretenir, pas de rappel. Six mois sans courir ne changent rien.',

  'site.about.choices': 'les partis pris',
  'site.about.choicesIntro':
    'La règle du projet tient en quatre mots : {rule}. Ce qu’elle donne, côté fabrication :',
  'site.about.choicesRule': 'une chose, bien faite',
  'site.about.choice.manual': 'saisie manuelle',
  'site.about.choice.manualNote': 'quatre champs, aucun capteur à autoriser',
  'site.about.choice.views': 'trois vues',
  'site.about.choice.viewsNote': 'liste, année, mois — et rien de plus',
  'site.about.choice.mono': 'monospace, sans couleur',
  'site.about.choice.monoNote': "les chiffres s'alignent, l'écran reste calme",
  'site.about.choice.open': 'code libre',
  'site.about.choice.openNote': "AGPL-3.0, reprenable par n'importe qui",

  'site.about.faq': 'questions fréquentes',
  'site.about.faq.data': 'Où sont mes données ?',
  'site.about.faq.dataBody':
    'Sur votre appareil, nulle part ailleurs. Vider le stockage du navigateur les efface : pensez à exporter.',
  'site.about.faq.devices': "Passer d'un appareil à l'autre ?",
  'site.about.faq.devicesBody':
    'Exportez race.json depuis le premier, importez-le sur le second — au choix en fusionnant avec ce qui s’y trouve déjà, ou en remplaçant tout. La synchronisation automatique, elle, demanderait un compte : ce n’est pas prévu.',
  'site.about.faq.watch': "Import depuis une montre ?",
  'site.about.faq.watchBody':
    "Pas de connexion directe pour le moment. L'import JSON reprend un historique ; sinon, une course s'ajoute en trente secondes.",
  'site.about.faq.price': 'Combien ça coûte ?',
  'site.about.faq.priceBody':
    "Rien, et il n'y a pas de version payante : sans serveur, il n'y a rien à financer.",
  'site.about.faq.stops': "Et si le projet s'arrête ?",
  'site.about.faq.stopsBody':
    'Elle continue de fonctionner, vos données sont chez vous et le code reste public.',

  'site.about.contact': 'Une critique, une idée, un bug ?',
  'site.about.contactNote': 'Le dépôt est ouvert, les issues aussi.',
  'site.about.report': 'signaler',
  'site.about.write': 'écrire',
  'site.about.legal': 'pages légales',

  // ————— site · journal des changements —————
  'site.changelog.metaTitle': 'race. — journal des changements',
  'site.changelog.metaDescription':
    'Ce qui a changé dans race., version par version.',
  'site.changelog.title': 'Journal des changements',
  'site.changelog.lede':
    'Ce qui a changé, version par version. Le même contenu que le fichier CHANGELOG.md du dépôt.',
  'site.changelog.type.added': 'ajouté',
  'site.changelog.type.changed': 'modifié',
  'site.changelog.type.fixed': 'corrigé',
  'site.changelog.type.performance': 'performance',

  // ————— pages légales —————
  'legal.updated': 'mise à jour {date}',
  'legal.terms.metaTitle': "race. — conditions d'utilisation",
  'legal.terms.title': "Conditions d'utilisation",
  'legal.terms.lede':
    "Courtes par construction : l'application ne collecte rien, ne vend rien et ne promet rien d'autre que de fonctionner.",
  'legal.terms.object': 'objet',
  'legal.terms.objectBody':
    "race. est un journal de courses personnel qui s'exécute sur votre appareil. Ni compte, ni service en ligne, ni abonnement.",
  'legal.terms.data': 'vos données',
  'legal.terms.dataBody':
    'Elles restent dans le stockage local du navigateur. Le vider ou désinstaller l’application les supprime définitivement : exportez votre fichier régulièrement.',
  'legal.terms.use': 'usage attendu',
  'legal.terms.useBody':
    'Usage personnel, non médical. Distances, durées et allures sont celles que vous saisissez : ni mesure officielle, ni conseil d’entraînement.',
  'legal.terms.licence': 'licence',
  'legal.terms.licenceBody':
    'Code publié sous AGPL-3.0. Vous pouvez l’utiliser, l’étudier, le modifier et le redistribuer ; toute version distribuée ou exposée en réseau doit rester sous la même licence, code source inclus.',
  'legal.terms.warranty': 'garantie',
  'legal.terms.warrantyBody':
    'Logiciel fourni « tel quel », sans garantie d’aucune sorte. La responsabilité de l’auteur ne peut être engagée en cas de perte de données.',
  'legal.terms.changes': 'évolutions',
  'legal.terms.changesBody':
    'Ces conditions peuvent changer avec une version majeure. La date figure en haut de page, l’historique dans le dépôt.',

  'legal.privacy.metaTitle': 'race. — confidentialité',
  'legal.privacy.title': 'Confidentialité',
  'legal.privacy.lede':
    'race. ne collecte aucune donnée. Rien ne quitte votre appareil.',
  'legal.privacy.sub':
    "Il n'existe aucun serveur à qui envoyer quoi que ce soit : c'est une conséquence de l'architecture, pas une promesse commerciale.",
  'legal.privacy.colSubject': 'sujet',
  'legal.privacy.colAnswer': 'ce que fait race.',
  'legal.privacy.account': 'compte utilisateur',
  'legal.privacy.accountBody': "aucun — pas d'e-mail, pas de mot de passe",
  'legal.privacy.storage': 'stockage',
  'legal.privacy.storageBody': "local à l'appareil, non chiffré par l'application",
  'legal.privacy.analytics': 'analytique, télémétrie',
  'legal.privacy.analyticsBody': 'aucune — aucun événement mesuré',
  'legal.privacy.cookies': 'cookies, traceurs',
  'legal.privacy.cookiesBody': 'aucun — donc aucune bannière de consentement',
  'legal.privacy.third': 'services tiers',
  'legal.privacy.thirdBody': 'aucun — aucune police, carte ou script distant',
  'legal.privacy.network': 'réseau',
  'legal.privacy.networkBody':
    "au téléchargement de l'application uniquement, jamais à l'usage",
  'legal.privacy.export': 'export',
  'legal.privacy.exportBody':
    'un fichier JSON que vous seul déclenchez et transmettez',
  'legal.privacy.rights': 'vos droits',
  'legal.privacy.rightsBody':
    "Accès, rectification, effacement et portabilité s'exercent directement dans l'application : consulter, modifier, supprimer une course, tout effacer, exporter le fichier. Aucune demande à adresser à personne — personne d'autre ne détient vos données.",

  'legal.notice.metaTitle': 'race. — mentions légales',
  'legal.notice.title': 'Mentions légales',
  'legal.notice.lede':
    'Éditeur et hébergeur du site de présentation. Les crochets marquent les valeurs à renseigner avant publication.',
  'legal.notice.publisher': 'éditeur',
  'legal.notice.publisherBody': "[nom de l'éditeur] — personne physique",
  'legal.notice.status': 'statut',
  'legal.notice.statusBody': 'projet personnel, sans activité commerciale',
  'legal.notice.director': 'responsable de publication',
  'legal.notice.directorBody': "[nom de l'éditeur]",
  'legal.notice.contact': 'contact',
  'legal.notice.host': 'hébergeur',
  'legal.notice.hostBody': "[nom de l'hébergeur], [adresse postale], [pays]",
  'legal.notice.ip': 'propriété intellectuelle',
  'legal.notice.ipBody':
    'code sous AGPL-3.0 ; nom et identité visuelle « race. » réservés',
  'legal.notice.mediation': 'médiation',
  'legal.notice.mediationBody':
    'aucune donnée traitée, aucun litige de service ; réclamations par e-mail',

  // ————— mise à jour —————
  // La version en attente ne s'installe pas d'elle-même : le bandeau annonce,
  // il ne prévient pas d'un fait accompli.
  'update.available': 'Une nouvelle version est prête.',
  'update.action': 'recharger',

  // ————— page introuvable —————
  'site.notfound.title': 'Cette page n’existe pas.',
  'site.notfound.body':
    'Le lien est peut-être ancien, ou mal recopié. Tout le reste fonctionne.',
  'site.notfound.action': 'revenir à la présentation',
} as const

export type MessageKey = keyof typeof fr
