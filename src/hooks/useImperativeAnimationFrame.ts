import { useCallback, useEffect, useMemo, useRef } from 'react';

type AnimationFrameCleanup = () => void;

type AnimationFrameCallback = (() => void) | (() => AnimationFrameCleanup);

type ScheduledState = {
  frameId: number;
  callback: AnimationFrameCallback;
};

type SettledState = {
  callback: AnimationFrameCallback;
  cleanup: AnimationFrameCleanup | undefined;
};

type UseImperativeAnimationFrameResult = {
  schedule: (callback: AnimationFrameCallback) => AnimationFrameCleanup;
  unschedule: (callback: AnimationFrameCallback) => void;
  clear: () => void;
};

/**
 * Schedules a single animation-frame callback.
 *
 * The callback may return a cleanup function, which is retained for the last
 * successful run and invoked when that run is cleared, superseded, or unmounted.
 */
export function useImperativeAnimationFrame(): UseImperativeAnimationFrameResult {
  const scheduledStateRef = useRef<ScheduledState | null>(null);
  const settledStateRef = useRef<SettledState | null>(null);

  const runSettledCleanup = useCallback(() => {
    settledStateRef.current?.cleanup?.();
    settledStateRef.current = null;
  }, []);

  const clear = useCallback(() => {
    if (scheduledStateRef.current === null) {
      runSettledCleanup();
      return;
    }

    cancelAnimationFrame(scheduledStateRef.current.frameId);
    scheduledStateRef.current = null;
    runSettledCleanup();
  }, [runSettledCleanup]);

  const unschedule = useCallback(
    (callback: AnimationFrameCallback) => {
      if (scheduledStateRef.current?.callback !== callback) {
        if (
          !scheduledStateRef.current &&
          settledStateRef.current?.callback === callback
        ) {
          runSettledCleanup();
        }

        return;
      }

      clear();
    },
    [clear, runSettledCleanup],
  );

  const schedule = useCallback(
    (callback: AnimationFrameCallback): AnimationFrameCleanup => {
      clear();

      scheduledStateRef.current = {
        frameId: requestAnimationFrame(() => {
          scheduledStateRef.current = null;
          runSettledCleanup();
          const cleanup = callback();

          settledStateRef.current = {
            callback,
            cleanup: typeof cleanup === 'function' ? cleanup : undefined,
          };
        }),
        callback,
      };

      return () => {
        unschedule(callback);
      };
    },
    [clear, runSettledCleanup, unschedule],
  );

  // Clear pending animation frame callbacks on unmount
  useEffect(() => clear, [clear]);

  return useMemo(
    () => ({
      schedule,
      unschedule,
      clear,
    }),
    [schedule, unschedule, clear],
  );
}
