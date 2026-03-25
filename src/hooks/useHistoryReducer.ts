import { useEffect, useReducer, type Dispatch, type Reducer } from 'react';
import {
  getStoredValue,
  resolveInitialValue,
  storeValue,
  type HistoryStateOptions,
} from '../lib/history-state';

type UseHistoryReducerResult<TState, TAction> = [TState, Dispatch<TAction>];

/**
 * Persists reducer state in `history.state` using `replaceState` so
 * tab/session restore can recover it.
 */
export function useHistoryReducer<TState, TAction>(
  key: string,
  reducer: Reducer<TState, TAction>,
  initialState: TState | (() => TState),
  options: HistoryStateOptions<TState>,
): UseHistoryReducerResult<TState, TAction> {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (initialValue): TState => {
      const storedValue = getStoredValue(key, options);
      if (storedValue !== undefined) return storedValue;
      return resolveInitialValue(initialValue);
    },
  );

  useEffect(() => {
    storeValue(key, state, options);
  }, [key, state, options]);

  return [state, dispatch];
}
