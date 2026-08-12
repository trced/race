/** Routage. Les chemins sont neutres : la langue est un réglage, pas une URL. */

import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router'
import { RaceApp } from './app/RaceApp.tsx'
import { I18nProvider } from './i18n/index.tsx'
import { DemoStoreProvider, StoreProvider, useStore } from './state/store.tsx'
import { AboutPage } from './site/AboutPage.tsx'
import { ChangelogPage } from './site/ChangelogPage.tsx'
import { HomePage } from './site/HomePage.tsx'
import {
  NoticePage,
  PrivacyPage,
  TermsPage,
} from './site/LegalPage.tsx'
import { NotFoundPage } from './site/NotFoundPage.tsx'
import { SiteLayout } from './site/SiteLayout.tsx'

/** /app?demo=1 ouvre l'application remplie, sans rien écrire sur l'appareil. */
function AppRoute() {
  const [params] = useSearchParams()
  if (params.get('demo') === '1') {
    return (
      <DemoStoreProvider>
        <RaceApp />
      </DemoStoreProvider>
    )
  }
  return <RaceApp />
}

function Localised({ children }: { children: React.ReactNode }) {
  const { lang } = useStore()
  return <I18nProvider lang={lang}>{children}</I18nProvider>
}

export function App() {
  return (
    <StoreProvider>
      <Localised>
        <BrowserRouter>
          <Routes>
            <Route path="/app" element={<AppRoute />} />
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/changelog" element={<ChangelogPage />} />
              <Route path="/legal/terms" element={<TermsPage />} />
              <Route path="/legal/privacy" element={<PrivacyPage />} />
              <Route path="/legal/notice" element={<NoticePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Localised>
    </StoreProvider>
  )
}
