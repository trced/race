import type { ChangelogVersion } from './types.ts'

/** Les entrées les plus récentes en premier. Jamais de réécriture d'un
 *  historique déjà publié — voir le skill /release. */
export const changelogVersions: ChangelogVersion[] = [
  {
    version: '0.1.1',
    date: '2026-08-13',
    changes: {
      added: [
        {
          text: "Vue Courbes : un type de course dans le temps, un point par course. Les distances officielles se tracent en temps ; le trail, l'ultra et « autre », qui n'ont pas de distance imposée, se tracent en allure — la seule mesure qui reste comparable quand chaque course a sa longueur",
          textEn:
            'Curves view: one race type over time, one point per race. Official distances are plotted as finish time; trail, ultra and “other”, which have no fixed distance, are plotted as pace — the only figure that stays comparable when every race has its own length',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: "L'axe n'est pas retourné : une course plus rapide est plus bas, et le graphique le dit en toutes lettres au lieu de le mimer. Les courses tracées sont listées dessous — c'est par là qu'on ouvre une fiche, et c'est ce que lit une synthèse vocale",
          textEn:
            'The axis is not flipped: a faster race sits lower, and the chart says so in words rather than miming it. The plotted races are listed underneath — that is where a race card is opened, and what a screen reader reads',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: 'Courbes est une quatrième destination, toujours à portée : en barre haute dès la tablette, au pied du téléphone en dessous',
          textEn:
            'Curves is a fourth destination, always within reach: in the tab bar from tablet width up, in the phone footer below it',
          category: 'Application',
          categoryEn: 'App',
        },
      ],
      changed: [
        {
          text: "Le pied du téléphone nomme ses destinations comme la barre haute — « année », « records », « courbes » — au lieu de « voir par année ». Une destination ne change plus de nom selon la largeur de l'écran",
          textEn:
            'The phone footer names its destinations exactly as the tab bar does — “year”, “records”, “curves” — instead of “view by year”. A destination no longer changes name with the width of the screen',
          category: 'Application',
          categoryEn: 'App',
        },
        {
          text: "La bibliothèque de tracé n'est téléchargée qu'à l'ouverture des Courbes : la liste, l'année, les records et la page de présentation n'en portent rien. Elle est précachée comme le reste — le hors-ligne est intact",
          textEn:
            'The chart library is fetched only when Curves is opened: the list, the year, the records and the presentation page carry none of its weight. It is precached like the rest — offline is unaffected',
          category: 'Infrastructure',
          categoryEn: 'Infrastructure',
        },
      ],
      fixed: [
        {
          text: "Toucher un champ sur un téléphone ne fait plus zoomer la page. Le texte des champs a désormais un plancher de 16 px sous un pointeur grossier : en dessous, Safari mobile zoome et ne revient jamais. Rien ne bouge à la souris, et le zoom à deux doigts reste possible — la fenêtre n'est pas verrouillée",
          textEn:
            'Focusing a field on a phone no longer zooms the page. Field text now has a floor of 16 px under a coarse pointer: below that, mobile Safari zooms in and never zooms back out. Nothing changes with a mouse, and pinch-to-zoom stays available — the viewport is not locked',
          category: 'Application',
          categoryEn: 'App',
        },
      ],
    },
  },
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
