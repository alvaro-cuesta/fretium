import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  getStoredValue,
  resolveInitialValue,
  storeValue,
  type HistoryStateOptions,
} from '../lib/history-state';

export const historyStateBoolean: HistoryStateOptions<boolean> = {
  serialize(value) {
    return value;
  },
  deserialize(value) {
    return typeof value === 'boolean'
      ? { type: 'success', value }
      : { type: 'error' };
  },
};

type UseHistoryStateResult<TValue> = [TValue, Dispatch<SetStateAction<TValue>>];

/**
 * Persists component state in `history.state` using `replaceState` so
 * tab/session restore can recover it.
 */
export function useHistoryState<TValue>(
  key: string,
  initialValue: TValue | (() => TValue),
  options: HistoryStateOptions<TValue>,
): UseHistoryStateResult<TValue> {
  const [state, setState] = useState<TValue>(() => {
    const storedValue = getStoredValue(key, options);
    if (storedValue !== undefined) return storedValue;
    return resolveInitialValue(initialValue);
  });

  useEffect(() => {
    storeValue(key, state, options);
  }, [key, state, options]);

  return [state, setState];
}
