import type { JsonValue } from 'type-fest';
import { checkIsNever } from './type';

export type HistoryStateDeserializeResult<TValue> =
  | { type: 'success'; value: TValue }
  | { type: 'error' };

export type HistoryStateOptions<TValue> = {
  serialize(value: TValue): JsonValue;
  // @todo Is `value` here guaranteed to be `unknown` or should it be `JsonValue`
  // since it's coming from `history.state`?
  deserialize(value: unknown): HistoryStateDeserializeResult<TValue>;
};

export function resolveInitialValue<TValue>(
  initialValue: TValue | (() => TValue),
): TValue {
  if (typeof initialValue === 'function') {
    return (initialValue as () => TValue)();
  }

  return initialValue;
}

function getHistoryState(): Record<string, unknown> | null {
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

export function storeValue<TValue>(
  key: string,
  value: TValue,
  options: HistoryStateOptions<TValue>,
): void {
  const historyState = getHistoryState();
  const serializedValue = options.serialize(value);

  // Avoid calling `replaceState` if the value to store is the same as the current
  // value in `history.state` since it would be a no-op
  if (historyState !== null && Object.is(historyState[key], serializedValue)) {
    return;
  }

  window.history.replaceState(
    {
      ...historyState,
      [key]: serializedValue,
    },
    '',
  );
}

export function getStoredValue<TValue>(
  key: string,
  options: HistoryStateOptions<TValue>,
): TValue | undefined {
  const historyState = getHistoryState();
  if (historyState === null) return undefined;
  const storedValue = historyState[key];

  const result = options.deserialize(storedValue);

  switch (result.type) {
    case 'success':
      return result.value;
    case 'error':
      return undefined;
    default:
      return checkIsNever(result);
  }
}
