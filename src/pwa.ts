import { registerSW } from 'virtual:pwa-register';

const SESSION_KEY = 'pwa-just-updated';

// How often to poll for a new SW. The browser only checks for updates on
// navigation, so long-running sessions would never see one without this.
const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Register the service worker and handle auto-updates.
 *
 * Flow:
 * 1. Browser finds new SW → `updatefound` fires → show persistent "Updating..."
 * 2. New SW activates + takes control → `controllerchange` → set flag → reload
 * 3. On next load, sessionStorage flag → show "Updated!" (auto-close 3s)
 *
 * sessionStorage bridges the reload boundary — React state is lost on reload,
 * and there's no SW API to detect "this load was triggered by an update."
 *
 * Periodic check: every UPDATE_CHECK_INTERVAL_MS we ask the browser to re-check
 * the SW script. If it changed, the normal updatefound → controllerchange flow
 * above takes over.
 */
export function initPwa(
  showToast: (msg: string, persistent?: boolean) => void,
) {
  // Check if we just reloaded after an update
  if (sessionStorage.getItem(SESSION_KEY) === '1') {
    sessionStorage.removeItem(SESSION_KEY);
    showToast('Updated!');
  }

  // Register the SW — autoUpdate makes it skipWaiting + clientsClaim
  registerSW({
    immediate: true,
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;

      // Show "Updating..." as soon as a new SW starts installing (before it
      // activates). The toast is persistent — it stays visible until the page
      // reloads after the new SW takes control. Skip on first install (no
      // active SW yet means this is the initial registration, not an update).
      registration.addEventListener('updatefound', () => {
        if (!registration.active) return;
        if (!registration.installing) return;
        showToast('Updating...', true);
      });

      setInterval(() => {
        void checkForSWUpdate(swUrl, registration);
      }, UPDATE_CHECK_INTERVAL_MS);
    },
  });

  // When the new SW takes control, flag and reload — but only if the page
  // already had a controller (= an update). On first-ever install the page
  // goes from no controller to having one, which also fires controllerchange.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- serviceWorker can be undefined in insecure contexts
  const hadController = !!navigator.serviceWorker?.controller;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!hadController) return;
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    sessionStorage.setItem(SESSION_KEY, '1');
    window.location.reload();
  });
}

/**
 * Ask the browser to re-check the SW script. We fetch the SW URL ourselves
 * first to avoid calling `update()` when offline or when the script is
 * unreachable (which would log noise). Recommended pattern from the
 * vite-plugin-pwa docs.
 */
async function checkForSWUpdate(
  swUrl: string,
  registration: ServiceWorkerRegistration,
) {
  if (registration.installing) return;
  if ('onLine' in navigator && !navigator.onLine) return;

  try {
    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: { 'cache-control': 'no-cache' },
    });
    if (resp.status !== 200) return;
    await registration.update();
  } catch {
    // Network errors are expected when offline / flaky — swallow them.
  }
}
