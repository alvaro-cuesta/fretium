import { registerSW } from 'virtual:pwa-register';

const SESSION_KEY = 'pwa-just-updated';

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
    onRegisteredSW(_swUrl, registration) {
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
