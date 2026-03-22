import { act, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { useMutationObserverLifecycle } from './useMutationObserverLifecycle';

type TestMutationObserverLifecycleCallback = Parameters<
  typeof useMutationObserverLifecycle<Node>
>[0];

type TestMutationObserverDeps = Parameters<
  typeof useMutationObserverLifecycle<Node>
>[1];

afterEach(() => {
  vi.unstubAllGlobals();
});

test('keeps observing through StrictMode effect replay', () => {
  const callback = vi.fn<TestMutationObserverLifecycleCallback>();
  const node = document.createElement('div');

  class MockMutationObserver {
    static latest: MockMutationObserver | null = null;
    callback: MutationCallback;
    isDisconnected = false;

    constructor(observerCallback: MutationCallback) {
      this.callback = observerCallback;
      MockMutationObserver.latest = this;
    }

    observe() {
      this.isDisconnected = false;
    }

    disconnect() {
      this.isDisconnected = true;
    }

    emit() {
      if (this.isDisconnected) {
        return;
      }

      this.callback([], this as unknown as MutationObserver);
    }
  }

  vi.stubGlobal('MutationObserver', MockMutationObserver);

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <StrictMode>{children}</StrictMode>
  );

  const { result } = renderHook(
    () => useMutationObserverLifecycle(callback, [], { childList: true }),
    { wrapper },
  );

  act(() => {
    result.current(node);
  });

  callback.mockClear();

  act(() => {
    MockMutationObserver.latest?.emit();
  });

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(node, [], expect.any(Object));
});

test('keeps the same observer while the callback changes', () => {
  const observe = vi.fn();
  const disconnect = vi.fn();
  let mutationCallback: MutationCallback | null = null;

  class MockMutationObserver {
    constructor(callback: MutationCallback) {
      mutationCallback = callback;
    }

    observe(...args: Parameters<MutationObserver['observe']>) {
      observe(...args);
    }

    disconnect() {
      disconnect();
    }
  }

  vi.stubGlobal('MutationObserver', MockMutationObserver);

  const callbackA = vi.fn<TestMutationObserverLifecycleCallback>();
  const callbackB = vi.fn<TestMutationObserverLifecycleCallback>();
  const node = document.createElement('div');
  const options = { childList: true };
  const { result, rerender } = renderHook(
    ({ callback }) =>
      useMutationObserverLifecycle(
        (...args) => callback(...args),
        [callback],
        options,
      ),
    { initialProps: { callback: callbackA } },
  );

  let cleanup: undefined | (() => void);

  act(() => {
    cleanup = result.current(node);
  });

  rerender({ callback: callbackB });

  act(() => {
    mutationCallback?.([], {} as MutationObserver);
  });

  expect(observe).toHaveBeenCalledTimes(1);
  expect(disconnect).not.toHaveBeenCalled();
  expect(callbackA).toHaveBeenCalledTimes(1);
  expect(callbackB).toHaveBeenCalledTimes(2);
  expect(callbackB).toHaveBeenCalledWith(node, [], expect.any(Object));

  act(() => {
    cleanup?.();
  });

  expect(disconnect).toHaveBeenCalledTimes(1);
});

test('disconnects when the ref is cleared', () => {
  const disconnect = vi.fn();

  class MockMutationObserver {
    observe() {
      // no-op
    }

    disconnect() {
      disconnect();
    }
  }

  vi.stubGlobal('MutationObserver', MockMutationObserver);

  const { result } = renderHook(
    ({ callback }) =>
      useMutationObserverLifecycle((...args) => callback(...args), [callback], {
        childList: true,
      }),
    {
      initialProps: {
        callback: vi.fn<TestMutationObserverLifecycleCallback>(),
      },
    },
  );
  const node = document.createElement('div');

  act(() => {
    const cleanup = result.current(node);
    cleanup?.();
    result.current(null);
  });

  expect(disconnect).toHaveBeenCalledTimes(1);
});

test('runs mutation callback cleanup before the next mutation and on disconnect', () => {
  let mutationCallback: MutationCallback | null = null;

  class MockMutationObserver {
    constructor(callback: MutationCallback) {
      mutationCallback = callback;
    }

    observe() {
      // no-op
    }

    disconnect() {
      // no-op
    }
  }

  vi.stubGlobal('MutationObserver', MockMutationObserver);

  const cleanupA = vi.fn();
  const cleanupB = vi.fn();
  const callback = vi
    .fn<TestMutationObserverLifecycleCallback>()
    .mockReturnValueOnce(cleanupA)
    .mockReturnValueOnce(cleanupB);
  const node = document.createElement('div');
  const { result } = renderHook(
    ({ callback }) =>
      useMutationObserverLifecycle((...args) => callback(...args), [callback], {
        childList: true,
      }),
    { initialProps: { callback } },
  );

  let disconnectCleanup: undefined | (() => void);

  act(() => {
    disconnectCleanup = result.current(node);
  });

  act(() => {
    mutationCallback?.([], {} as MutationObserver);
    mutationCallback?.([], {} as MutationObserver);
  });

  expect(cleanupA).toHaveBeenCalledTimes(1);
  expect(cleanupB).toHaveBeenCalledTimes(1);

  act(() => {
    disconnectCleanup?.();
  });

  expect(cleanupB).toHaveBeenCalledTimes(1);
});

test('runs callback when dependencies change while observing', () => {
  const callback = vi.fn<TestMutationObserverLifecycleCallback>();
  const node = document.createElement('div');
  const options = { childList: true };
  const { result, rerender } = renderHook(
    ({ deps }) => useMutationObserverLifecycle(callback, deps, options),
    { initialProps: { deps: [1] satisfies TestMutationObserverDeps } },
  );

  act(() => {
    result.current(node);
  });

  callback.mockClear();

  rerender({ deps: [2] satisfies TestMutationObserverDeps });

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(node, [], expect.any(Object));
});

test('runs the lifecycle callback with empty mutation records when observing starts', () => {
  class MockMutationObserver {
    observe() {
      // no-op
    }

    disconnect() {
      // no-op
    }
  }

  vi.stubGlobal('MutationObserver', MockMutationObserver);

  const callback = vi.fn<TestMutationObserverLifecycleCallback>();
  const node = document.createElement('div');
  const { result } = renderHook(() =>
    useMutationObserverLifecycle(callback, [], { childList: true }),
  );

  act(() => {
    result.current(node);
  });

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(node, [], expect.any(Object));
});
