import { act, renderHook } from '@testing-library/react';
import { useImperativeTimeout } from './useImperativeTimeout';

afterEach(() => {
  vi.useRealTimers();
});

test('runs only the latest scheduled timeout callback', () => {
  vi.useFakeTimers();

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeTimeout());

  act(() => {
    result.current.schedule(callbackA, 1000);
    result.current.schedule(callbackB, 1000);
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);
});

test('clears pending timeout callbacks', () => {
  vi.useFakeTimers();

  const callback = vi.fn();
  const { result } = renderHook(() => useImperativeTimeout());

  act(() => {
    result.current.schedule(callback, 1000);
    result.current.clear();
    vi.advanceTimersByTime(1000);
  });

  expect(callback).not.toHaveBeenCalled();
});

test('unschedules only the currently scheduled timeout callback', () => {
  vi.useFakeTimers();

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeTimeout());

  act(() => {
    result.current.schedule(callbackA, 1000);
    result.current.schedule(callbackB, 1000);
    result.current.unschedule(callbackA);
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);
});

test('schedule cleanup does not cancel a later timeout callback', () => {
  vi.useFakeTimers();

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeTimeout());

  let cleanupA!: () => void;

  act(() => {
    cleanupA = result.current.schedule(callbackA, 1000);
    result.current.schedule(callbackB, 1000);
    cleanupA();
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);
});

test('runs callback cleanup when cleared after execution', () => {
  vi.useFakeTimers();

  const callbackCleanup = vi.fn();
  const callback = vi.fn(() => callbackCleanup);
  const { result } = renderHook(() => useImperativeTimeout());

  act(() => {
    result.current.schedule(callback, 1000);
    vi.advanceTimersByTime(1000);
    result.current.clear();
  });

  expect(callbackCleanup).toHaveBeenCalledTimes(1);
});

test('runs previous callback cleanup before next timeout callback execution', () => {
  vi.useFakeTimers();

  const cleanupA = vi.fn();
  const callbackA = vi.fn(() => cleanupA);
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeTimeout());

  act(() => {
    result.current.schedule(callbackA, 1000);
    vi.advanceTimersByTime(1000);
    result.current.schedule(callbackB, 1000);
    vi.advanceTimersByTime(1000);
  });

  expect(cleanupA).toHaveBeenCalledTimes(1);
  expect(callbackB).toHaveBeenCalledTimes(1);
});
