import { useCallback, useEffect, useRef } from 'react';

type TimeoutCallback = () => void;

export function useTimeout() {
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (!timeoutIdRef.current) {
      return;
    }

    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;
  }, []);

  const schedule = useCallback(
    (callback: TimeoutCallback, delayMs: number) => {
      clear();
      timeoutIdRef.current = setTimeout(() => {
        timeoutIdRef.current = null;
        callback();
      }, delayMs);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return {
    schedule,
    clear,
  };
}
