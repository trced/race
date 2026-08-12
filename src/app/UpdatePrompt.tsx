/** Le bandeau de mise à jour.
 *
 *  Une nouvelle version arrive par le service worker, qui la précache puis
 *  attend. Rien ne bouge tant que personne n'a dit oui : le journal vit dans
 *  le navigateur et nulle part ailleurs, et un rechargement décidé tout seul
 *  au milieu d'une saisie emporterait ce qui n'est pas encore écrit.
 *
 *  D'où deux sorties, et aucune troisième. « recharger » donne la main au
 *  worker en attente, qui s'active et fait recharger la page. « fermer » range
 *  le bandeau : l'ancienne version continue de tourner, la nouvelle reste en
 *  attente, et la proposition revient au prochain démarrage. Rien n'est perdu
 *  d'un côté comme de l'autre. */

import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '../components/Button.tsx'
import { useI18n } from '../i18n/index.tsx'

/** Une heure. Assez rare pour ne rien coûter, assez fréquent pour qu'une
 *  version publiée le matin soit proposée dans la journée. */
const CHECK_INTERVAL_MS = 60 * 60 * 1000

/** Le navigateur ne redemande le worker que lorsqu'il charge une page. Une
 *  application installée, elle, n'en charge plus : elle reprend là où on l'a
 *  laissée, parfois des jours plus tard. Sans relance explicite, la version
 *  publiée entre-temps n'arrive jamais — c'est le cas que le mode installé
 *  rend systématique, et la raison d'être de ce qui suit. */
function watchForUpdate(registration: ServiceWorkerRegistration | undefined) {
  if (!registration) return

  const check = () => {
    // Redemander pendant une installation la relancerait pour rien ; hors
    // ligne, la requête échouerait à coup sûr.
    if (registration.installing || !navigator.onLine) return
    void registration.update().catch(() => {})
  }

  // Revenir sur l'application est le moment où la question se pose : c'est
  // là qu'on la repose, plutôt qu'à l'aveugle toutes les heures seulement.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })
  window.setInterval(check, CHECK_INTERVAL_MS)
}

export function UpdatePrompt() {
  const { t } = useI18n()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (_url, registration) => watchForUpdate(registration),
  })

  /** Donner la main au worker en attente, puis recharger.
   *
   *  Le rechargement est normalement l'affaire du module d'enregistrement,
   *  qui écoute le changement de contrôleur. Il s'en abstient dans un cas :
   *  la page qui a installé le tout premier worker n'était contrôlée par
   *  personne au départ, et il n'y voit donc pas une mise à jour. Le worker
   *  s'active, la page reste sur l'ancienne version, et le bandeau ne s'en
   *  va plus.
   *
   *  D'où ce second rechargement, armé au clic seulement : `clientsClaim`
   *  change lui aussi de contrôleur à la première visite, et recharger sur
   *  ce signal-là, sans y avoir été invité, tournerait en boucle. */
  const reload = () => {
    navigator.serviceWorker?.addEventListener(
      'controllerchange',
      () => window.location.reload(),
      { once: true },
    )
    void updateServiceWorker()
  }

  // Le composant reste monté même sans rien à montrer : c'est lui qui tient
  // l'enregistrement du worker.
  if (!needRefresh) return null

  return (
    <div className="update" role="status" aria-live="polite">
      <p className="update__message">{t('update.available')}</p>
      <div className="update__actions">
        <Button variant="primary" onClick={reload}>
          {t('update.action')}
        </Button>
        <Button
          onClick={() => {
            setNeedRefresh(false)
          }}
        >
          {t('common.close')}
        </Button>
      </div>
    </div>
  )
}
