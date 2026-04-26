// Shared callback so non-React code (PWA update handler) can show toasts.
let listener: ((message: string, persistent?: boolean) => void) | null = null;

export function setGlobalToastListener(fn: typeof listener) {
  listener = fn;
}

export function showGlobalToast(message: string, persistent?: boolean) {
  listener?.(message, persistent);
}
