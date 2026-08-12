/*
 * race. — un journal de courses personnel qui s'exécute sur votre appareil.
 * Copyright (C) 2026  les auteurs de race.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Contact : contact@race.app — code source : https://github.com/trced/race
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App.tsx'
import { hasRaces } from './lib/storage.ts'

import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/app.css'
import './styles/site.css'

/** Arriver sur « / » avec un journal déjà commencé ouvre l'application : la
 *  page de présentation n'a plus rien à présenter à qui s'en sert.
 *
 *  Décidé ici, avant le montage, et non dans une route : le routeur lit
 *  l'URL une fois, donc l'arbitrage ne se rejoue pas et les navigations
 *  suivantes vers « / » sont respectées — sinon le lien « présentation » du
 *  site se retournerait contre lui-même, et un retour arrière depuis
 *  l'application rebondirait en boucle.
 *
 *  replaceState plutôt que redirection : « / » ne laisse pas d'entrée dans
 *  l'historique, donc le bouton retour sort du site au lieu d'y revenir. */
if (window.location.pathname === '/' && hasRaces()) {
  window.history.replaceState(null, '', '/app')
}

const root = document.getElementById('root')
if (!root) throw new Error('#root introuvable')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Mise à jour silencieuse : la version suivante s'installe au rechargement.
registerSW({ immediate: true })
