import { useCallback, useEffect, useState, type Dispatch } from 'react';
import {
  getHistoryState,
  getStoredValue,
  resolveInitialValue,
  type HistoryStateOptions,
} from '../lib/history-state';

type UseHistoryStateResult<TValue> = [TValue, Dispatch<TValue>];

/**
 * Persists component state in `history.state` using `replaceState` so
 * tab/session restore can recover it.
 */
export function useHistoryState<TValue>(
  key: string,
  initialValue: TValue | (() => TValue),
  options: HistoryStateOptions<TValue>,
): UseHistoryStateResult<TValue> {
  // eslint-disable-next-line react-x/use-state
  const [state, setStateOriginal] = useState<TValue>(() => {
    const storedValue = getStoredValue(key, options);

    if (storedValue !== undefined) {
      return storedValue;
    }

    return resolveInitialValue(initialValue);
  });

  useEffect(() => {
    const historyState = getHistoryState();
    if (historyState !== null && Object.is(historyState[key], state)) {
      return;
    }

    window.history.replaceState(
      {
        ...historyState,
        [key]: state,
      },
      '',
    );
  }, [key, state]);

  // @todo Implement updater (Dispatch<SetStateAction<TValue>>) if ever needed
  const setState = useCallback((newState: TValue) => {
    setStateOriginal(newState);
  }, []);

  return [state, setState];
}
