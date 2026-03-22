import { useEffect } from 'react';
import { useLatest } from './useLatest';

export function useDismiss(
  targetRef: React.RefObject<HTMLElement | null>,
  handler: () => void,
  isEnabled: boolean,
) {
  const latestHandler = useLatest(handler);
  const latestIsEnabled = useLatest(isEnabled);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        !latestIsEnabled.current ||
        !event.target ||
        targetRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      latestHandler.current();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!latestIsEnabled.current) {
        return;
      }

      if (event.key === 'Escape') {
        latestHandler.current();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [latestIsEnabled, latestHandler, targetRef]);
}
