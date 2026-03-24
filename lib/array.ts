export function findIndex<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
): number | null {
  const indexRaw = array.findIndex(predicate);
  return indexRaw !== -1 ? indexRaw : null;
}

export function findLastIndex<T>(
  array: readonly T[],
  predicate: (value: T, index: number, array: readonly T[]) => boolean,
): number | null {
  const indexRaw = array.findLastIndex(predicate);
  return indexRaw !== -1 ? indexRaw : null;
}

export function chunks<T>(array: readonly T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
