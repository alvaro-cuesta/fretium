export type HistoryStateOptions<TValue> = {
  isValid: (value: unknown) => value is TValue;
};

export function resolveInitialValue<TValue>(
  initialValue: TValue | (() => TValue),
): TValue {
  if (typeof initialValue === 'function') {
    return (initialValue as () => TValue)();
  }

  return initialValue;
}

export function getHistoryState(): Record<string, unknown> | null {
  const historyState: unknown = window.history.state;

  if (
    typeof historyState !== 'object' ||
    historyState === null ||
    Array.isArray(historyState)
  ) {
    return null;
  }

  return historyState as Record<string, unknown>;
}

export function getStoredValue<TValue>(
  key: string,
  options: HistoryStateOptions<TValue>,
): TValue | undefined {
  const historyState = getHistoryState();
  if (historyState === null) return undefined;
  const storedValue = historyState[key];
  return options.isValid(storedValue) ? storedValue : undefined;
}
