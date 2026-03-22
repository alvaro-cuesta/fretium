import { useCallback, useEffect, useMemo, useRef } from 'react';

type TimeoutCleanup = () => void;

type TimeoutCallback = (() => void) | (() => TimeoutCleanup);

type ScheduledState = {
  timeoutId: ReturnType<typeof setTimeout>;
  callback: TimeoutCallback;
};

type SettledState = {
  callback: TimeoutCallback;
  cleanup: TimeoutCleanup | undefined;
};

type UseImperativeTimeoutResult = {
  schedule: (callback: TimeoutCallback, delayMs: number) => TimeoutCleanup;
  unschedule: (callback: TimeoutCallback) => void;
  clear: () => void;
};

/**
 * Schedules a single timeout callback.
 *
 * The callback may return a cleanup function, which is retained for the last
 * successful run and invoked when that run is cleared, superseded, or unmounted.
 */
export function useImperativeTimeout(): UseImperativeTimeoutResult {
  const scheduledStateRef = useRef<ScheduledState | null>(null);
  const settledStateRef = useRef<SettledState | null>(null);

  const runSettledCleanup = useCallback(() => {
    settledStateRef.current?.cleanup?.();
    settledStateRef.current = null;
  }, []);

  const clear = useCallback(() => {
    if (!scheduledStateRef.current) {
      runSettledCleanup();
      return;
    }

    clearTimeout(scheduledStateRef.current.timeoutId);
    scheduledStateRef.current = null;
    runSettledCleanup();
  }, [runSettledCleanup]);

  const unschedule = useCallback(
    (callback: TimeoutCallback) => {
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
    (callback: TimeoutCallback, delayMs: number) => {
      clear();
      scheduledStateRef.current = {
        timeoutId: setTimeout(() => {
          scheduledStateRef.current = null;
          runSettledCleanup();
          const cleanup = callback();

          settledStateRef.current = {
            callback,
            cleanup: typeof cleanup === 'function' ? cleanup : undefined,
          };
        }, delayMs),
        callback,
      };

      return () => {
        unschedule(callback);
      };
    },
    [clear, runSettledCleanup, unschedule],
  );

  // Clear pending timeout callbacks on unmount
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
