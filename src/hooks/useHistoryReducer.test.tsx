import { act, renderHook, waitFor } from '@testing-library/react';
import { useHistoryReducer } from './useHistoryReducer';

type CounterState = {
  count: number;
};

type CounterAction = { type: 'INCREMENT' } | { type: 'SET'; count: number };

function counterReducer(
  state: CounterState,
  action: CounterAction,
): CounterState {
  switch (action.type) {
    case 'INCREMENT': {
      return {
        count: state.count + 1,
      };
    }
    case 'SET': {
      return {
        count: action.count,
      };
    }
  }
}

function isCounterState(value: unknown): value is CounterState {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'count' in value &&
    typeof value.count === 'number'
  );
}

function deserializeCounterState(value: unknown) {
  return isCounterState(value)
    ? { type: 'success' as const, value }
    : { type: 'error' as const };
}

afterEach(() => {
  window.history.replaceState(null, '');
  vi.restoreAllMocks();
});

test('initializes from history.state and preserves other history keys', () => {
  window.history.replaceState(
    {
      counter: {
        count: 7,
      },
      untouched: true,
    },
    '',
  );

  const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

  const { result } = renderHook(() =>
    useHistoryReducer(
      'counter',
      counterReducer,
      { count: 0 },
      {
        serialize: (value) => value,
        deserialize: deserializeCounterState,
      },
    ),
  );

  expect(result.current[0]).toEqual({ count: 7 });

  act(() => {
    result.current[1]({ type: 'INCREMENT' });
  });

  expect(replaceStateSpy).toHaveBeenCalledWith(
    {
      counter: {
        count: 8,
      },
      untouched: true,
    },
    '',
  );
});

test('falls back to default state when stored value is invalid', async () => {
  window.history.replaceState(
    {
      counter: 'invalid-state',
    },
    '',
  );

  const { result } = renderHook(() =>
    useHistoryReducer(
      'counter',
      counterReducer,
      { count: 3 },
      {
        serialize: (value) => value,
        deserialize: deserializeCounterState,
      },
    ),
  );

  expect(result.current[0]).toEqual({ count: 3 });

  await waitFor(() => {
    const historyState = window.history.state as Record<string, unknown> | null;
    expect(historyState?.['counter']).toEqual({ count: 3 });
  });
});
