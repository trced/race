# race.

![version](https://img.shields.io/badge/version-v0.1.0-17181a)
![licence](https://img.shields.io/badge/licence-AGPL--3.0-17181a)
![PWA](https://img.shields.io/badge/PWA-hors%20ligne-17181a)

**Toutes vos courses. Une ligne chacune.**

race. répond à une seule question : *qu'est-ce que j'ai couru ?* Pas de plan
d'entraînement, pas de graphique, pas de classement. Vous notez la course,
elle reste lisible dans dix ans.

Sans compte, sans réseau, sans version payante. Tout vit dans le stockage
local de votre navigateur ; le seul format d'échange est un fichier
`race.json` que vous exportez et importez vous-même.

---

## Ce que c'est

| | |
|---|---|
| **Unité** | une course — nom, date, distance, durée ; lieu, D+ et notes facultatifs |
| **Vues** | Liste (par défaut) · Année · Mois · Records |
| **Vocabulaire** | ● une course a eu lieu · `·` rien ce mois-là · un trait vertical prolonge une course de plusieurs jours |
| **Données** | `localStorage`, `schemaVersion` 1, export/import JSON |
| **Langues** | français, anglais, ou celle du système |
| **Licence** | AGPL-3.0-or-later |

## Ce que ce n'est pas

- aucun suivi GPS, aucune montre à connecter
- aucun badge, aucune série à ne pas rompre
- aucun partage, aucun classement
- aucune notification, aucun cookie, aucune télémétrie

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
```

| commande | effet |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` | typecheck puis build de production dans `dist/` |
| `npm run preview` | sert le build de production |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | suite de tests (Vitest) |
| `npm run test:watch` | tests en continu |
| `npm run icons` | régénère les icônes PWA dans `public/` |

## Architecture

```
src/
├── lib/                  noyau pur, sans React ni DOM
│   ├── types.ts          Race, Settings, RaceFile, schemaVersion
│   ├── format.ts         durées, distances, allures, dates (Intl)
│   ├── validate.ts       validation du formulaire → clés i18n
│   ├── calendar.ts       construction de la vue Mois, creux et continuations
│   ├── records.ts        meilleurs temps, extrêmes, totaux
│   ├── io.ts             race.json : lecture, écriture, fusion
│   └── storage.ts        persistance locale
├── i18n/                 fr.ts (référence) + en.ts (miroir typé) + runtime
├── state/store.tsx       source unique : courses + réglages
├── components/           design system « famille . » 1.1.0
├── app/                  l'application — vues et panneaux
├── site/                 pages web — présentation, à propos, légales
├── data/changelog/       journal des changements, bilingue
└── styles/               tokens.css, base.css, components.css, app.css, site.css
```

Le noyau `lib/` ne connaît ni React ni le DOM : il se teste sans navigateur et
porte toute la logique qui pourrait se tromper.

### Décisions

- **Le stockage est le format d'export.** Ce qui est lu par l'application est
  exactement ce qui en sort — pas de conversion à la frontière, donc pas
  d'endroit où les deux formes divergent.
- **La validation renvoie des clés, pas des phrases.** `app.edit.error.date`
  se traduit à l'affichage ; le noyau reste indépendant de la langue.
- **Les distances sont stockées en kilomètres**, saisies et affichées dans
  l'unité choisie. Un champ que l'utilisateur n'a pas touché n'est jamais
  réécrit : passer en miles puis enregistrer ne dégrade pas la valeur.
- **Le mode exemple ne duplique pas les réglages.** Il remplace seulement la
  liste des courses ; le thème réglé depuis la démonstration est un vrai
  réglage, le journal personnel n'est jamais touché.
- **Rien n'est écrit à la simple ouverture.** La première écriture attend le
  premier changement d'état.

## Design system

L'implémentation suit la famille « . » (*trced*) version 1.1.0, dont la
référence est dans [`docs/Design System v1.1.dc.html`](docs/Design%20System%20v1.1.dc.html).
Les maquettes de race. sont dans [`docs/race.dc.html`](docs/race.dc.html) et
[`docs/RaceApp.dc.html`](docs/RaceApp.dc.html).

Tokens dans `src/styles/tokens.css` : une valeur en dur dans un composant est
un défaut de conformité. Contraintes tenues :

- CSS du système ≤ 8 ko compressé (actuellement ~5 ko)
- zéro police distante, zéro image dans l'interface, zéro dépendance UI tierce
- cible tactile 44 × 44, focus visible 2 px / offset 3, WCAG 2.2 AA
- aucune ombre portée ; le trait de 1 px est la seule séparation

## Vie privée

Il n'existe aucun serveur à qui envoyer quoi que ce soit. Le service worker
précache l'application au téléchargement, puis plus aucune requête réseau
n'est émise à l'usage. Pas de cookie, donc pas de bannière de consentement.

Vider le stockage du navigateur efface les données définitivement :
Réglages → exporter, régulièrement.

## Contribuer

Le dépôt est ouvert, les issues aussi. Avant d'ajouter un composant :
prouver que trois écrans en ont besoin, vérifier qu'aucune composition
existante ne suffit, documenter anatomie, états, API et accessibilité.

Une fonctionnalité qui ne sert pas la question *« qu'est-ce que j'ai
couru ? »* n'est pas ajoutée.

## Licence

AGPL-3.0-or-later. Libre et copyleft : toute version modifiée et distribuée,
y compris exposée en réseau, reste libre, code source inclus.

---

race. 0.1 — une chose. bien faite.
