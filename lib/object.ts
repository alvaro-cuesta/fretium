type ObjectKey<TObject extends Record<string, unknown>> = Extract<
  keyof TObject,
  string
>;

type ObjectEntry<TObject extends Record<string, unknown>> = {
  [K in keyof TObject]-?: [K, TObject[K]];
}[keyof TObject];

export function objectKeys<TObject extends Record<string, unknown>>(
  obj: TObject,
): ObjectKey<TObject>[] {
  return Object.keys(obj) as ObjectKey<TObject>[];
}

export function objectEntries<TObject extends Record<string, unknown>>(
  obj: TObject,
): ObjectEntry<TObject>[] {
  return Object.entries(obj) as ObjectEntry<TObject>[];
}

export function fromEntries<K extends string, V>(
  entries: readonly (readonly [K, V])[],
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}
