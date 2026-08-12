import type { ChangelogVersion } from './types.ts'

/** Les entrées les plus récentes en premier. Jamais de réécriture d'un
 *  historique déjà publié — voir le skill /release. */
export const changelogVersions: ChangelogVersion[] = [
  {
    version: '0.1.0',
    date: '2026-08-11',
    changes: {
      added: [
        {
          text: "L'application : trois vues sur un journal de courses — Liste pour tout revoir, Année pour la densité, Mois pour le détail. Une course par ligne, un point quand elle a eu lieu, un trait vertical quand elle dure plusieurs jours",
          textEn:
            'The app: three views over a race logbook — List to review everything, Year for density, Month for detail. One race per line, a dot when it took place, a vertical line when it spans several days',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: 'Saisie manuelle en quatre champs obligatoires — nom, date, distance, durée — et trois facultatifs : dénivelé, lieu, notes. La distance officielle se remplit toute seule au choix du type',
          textEn:
            'Manual entry in four required fields — name, date, distance, duration — and three optional ones: climb, place, notes. The official distance fills itself in when the type is picked',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: 'Recherche libre sur le nom, le lieu, le type, les notes et la date, filtre par type et trois tris — date décroissante, date croissante, distance décroissante',
          textEn:
            'Free search across name, place, type, notes and date, a filter by type and three sorts — newest first, oldest first, longest first',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: 'Vue Records : meilleur temps par distance officielle avec l’écart sur la deuxième, la course la plus longue, celle qui grimpe le plus, et les totaux',
          textEn:
            'Records view: best time per official distance with the gap to the second, the longest race, the one that climbs the most, and the totals',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: 'Réglages : thème clair, sombre ou système ; langue française, anglaise ou système ; kilomètres ou miles ; allure affichée ou masquée ; vue par défaut',
          textEn:
            'Settings: light, dark or system theme; French, English or system language; kilometres or miles; pace shown or hidden; default view',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: 'Export et import du fichier race.json, avec le choix entre fusionner et remplacer, et un effacement complet sous confirmation explicite',
          textEn:
            'Export and import of the race.json file, with a choice between merging and replacing, plus a full erase behind an explicit confirmation',
          category: 'Données',
          categoryEn: 'Data',
        },
        {
          text: 'PWA installable et utilisable hors ligne : tout est précaché au téléchargement, aucune requête réseau à l’usage',
          textEn:
            'Installable, offline-capable PWA: everything is precached on download, with no network request in use',
          category: 'Infrastructure',
          categoryEn: 'Infrastructure',
        },
        {
          text: 'Site de présentation en français et en anglais : page d’accueil avec l’application réelle incrustée, page à propos, conditions d’utilisation, confidentialité, mentions légales et journal des changements',
          textEn:
            'Presentation site in French and English: home page with the real app embedded, about page, terms of use, privacy, legal notice and changelog',
          category: 'Contenu',
          categoryEn: 'Content',
        },
        {
          text: 'Mode exemple accessible depuis la présentation : l’application remplie d’un jeu de dix courses, sans rien écrire sur l’appareil',
          textEn:
            'Example mode reachable from the overview: the app filled with a set of ten races, writing nothing to the device',
          category: 'Contenu',
          categoryEn: 'Content',
        },
        {
          text: 'Design system « famille . » 1.1.0 implémenté en tokens CSS : couleur, typographie, espace, forme, mouvement, et dix composants documentés',
          textEn:
            'The “famille .” 1.1.0 design system implemented as CSS tokens: colour, typography, space, shape, motion, and ten documented components',
          category: 'Design',
          categoryEn: 'Design',
        },
      ],
    },
  },
]
