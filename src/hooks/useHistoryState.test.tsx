import { act, renderHook } from '@testing-library/react';
import { useHistoryState } from './useHistoryState';

afterEach(() => {
  window.history.replaceState(null, '');
  vi.restoreAllMocks();
});

test('initializes from history.state and preserves other history keys', () => {
  window.history.replaceState(
    {
      field: 'from-history',
      untouched: true,
    },
    '',
  );

  const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

  const { result } = renderHook(() =>
    useHistoryState('field', 'default', {
      isValid: (value): value is string => typeof value === 'string',
    }),
  );

  expect(result.current[0]).toBe('from-history');

  act(() => {
    result.current[1]('next-value');
  });

  expect(replaceStateSpy).toHaveBeenCalledWith(
    {
      field: 'next-value',
      untouched: true,
    },
    '',
  );
});

test('falls back to default value when stored value is invalid', () => {
  window.history.replaceState(
    {
      numericField: 'not-a-number',
    },
    '',
  );

  const { result } = renderHook(() =>
    useHistoryState('numericField', 12, {
      isValid: (value): value is number => typeof value === 'number',
    }),
  );

  expect(result.current[0]).toBe(12);
  const historyState = window.history.state as Record<string, unknown> | null;
  expect(historyState?.['numericField']).toBe(12);
});
