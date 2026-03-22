import { act, renderHook } from '@testing-library/react';
import { useImperativeAnimationFrame } from './useImperativeAnimationFrame';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('runs only the latest scheduled animation frame callback', () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => {
      callbacks.delete(id);
    }),
  );

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeAnimationFrame());

  act(() => {
    result.current.schedule(callbackA);
    result.current.schedule(callbackB);
  });

  act(() => {
    for (const callback of callbacks.values()) {
      callback(0);
    }
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);
});

test('clears pending animation frame callbacks', () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => {
      callbacks.delete(id);
    }),
  );

  const callback = vi.fn();
  const { result } = renderHook(() => useImperativeAnimationFrame());

  act(() => {
    result.current.schedule(callback);
    result.current.clear();
  });

  act(() => {
    const pendingCallbacks = [...callbacks.values()];
    callbacks.clear();

    for (const frameCallback of pendingCallbacks) {
      frameCallback(0);
    }
  });

  expect(callback).not.toHaveBeenCalled();
});

test('unschedules only the currently scheduled callback', () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => {
      callbacks.delete(id);
    }),
  );

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeAnimationFrame());

  act(() => {
    result.current.schedule(callbackA);
    result.current.schedule(callbackB);
    result.current.unschedule(callbackA);
  });

  act(() => {
    for (const callback of callbacks.values()) {
      callback(0);
    }
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);
});

test('schedule cleanup does not cancel a later callback', () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => {
      callbacks.delete(id);
    }),
  );

  const callbackA = vi.fn();
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeAnimationFrame());

  let cleanupA: () => void;

  act(() => {
    cleanupA = result.current.schedule(callbackA);
    result.current.schedule(callbackB);
    cleanupA();
  });

  act(() => {
    for (const callback of callbacks.values()) {
      callback(0);
    }
  });

  expect(callbackA).not.toHaveBeenCalled();
  expect(callbackB).toHaveBeenCalledTimes(1);
});

test('runs callback cleanup when cleared after execution', () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => {
      callbacks.delete(id);
    }),
  );

  const callbackCleanup = vi.fn();
  const callback = vi.fn(() => callbackCleanup);
  const { result } = renderHook(() => useImperativeAnimationFrame());

  act(() => {
    result.current.schedule(callback);
  });

  act(() => {
    const pendingCallbacks = [...callbacks.values()];
    callbacks.clear();

    for (const frameCallback of pendingCallbacks) {
      frameCallback(0);
    }
  });

  act(() => {
    result.current.clear();
  });

  expect(callbackCleanup).toHaveBeenCalledTimes(1);
});

test('runs previous callback cleanup before next callback execution', () => {
  let nextId = 1;
  const callbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      const id = nextId;
      nextId += 1;
      callbacks.set(id, callback);
      return id;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => {
      callbacks.delete(id);
    }),
  );

  const cleanupA = vi.fn();
  const callbackA = vi.fn(() => cleanupA);
  const callbackB = vi.fn();
  const { result } = renderHook(() => useImperativeAnimationFrame());

  act(() => {
    result.current.schedule(callbackA);
  });

  act(() => {
    const pendingCallbacks = [...callbacks.values()];
    callbacks.clear();

    for (const frameCallback of pendingCallbacks) {
      frameCallback(0);
    }
  });

  act(() => {
    result.current.schedule(callbackB);
  });

  act(() => {
    const pendingCallbacks = [...callbacks.values()];
    callbacks.clear();

    for (const frameCallback of pendingCallbacks) {
      frameCallback(0);
    }
  });

  expect(cleanupA).toHaveBeenCalledTimes(1);
  expect(callbackB).toHaveBeenCalledTimes(1);
});
