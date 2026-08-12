import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App.tsx'

import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/app.css'
import './styles/site.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root introuvable')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Mise à jour silencieuse : la version suivante s'installe au rechargement.
registerSW({ immediate: true })
