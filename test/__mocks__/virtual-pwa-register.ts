// Mock for virtual:pwa-register — the real module is only available at build
// time via vite-plugin-pwa. In tests we just no-op the registration.
export function registerSW() {
  return () => {
    // no-op
  };
}
