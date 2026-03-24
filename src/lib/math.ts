export function clamp<T extends number>(value: T, min: T, max: T): T {
  return Math.max(min, Math.min(max, value)) as T;
}
