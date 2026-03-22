import { act, renderHook } from '@testing-library/react';
import { useTimeout } from './useTimeout';

test('runs only the latest scheduled timeout callback', () => {
  vi.useFakeTimers();

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useTimeout());

  act(() => {
    result.current.schedule(callbackA, 1000);
    result.current.schedule(callbackB, 1000);
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);

  vi.useRealTimers();
});

test('clears pending timeout callbacks', () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const { result } = renderHook(() => useTimeout());

  act(() => {
    result.current.schedule(callback, 1000);
    result.current.clear();
    vi.advanceTimersByTime(1000);
  });

  expect(callback).not.toHaveBeenCalled();

  vi.useRealTimers();
});
