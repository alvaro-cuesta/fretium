import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getStoredValue,
  storeValue,
  type HistoryStateOptions,
} from '../../lib/history-state.ts';
import {
  DEFAULT_FRETBOARD_CONFIG,
  deserializeFretboardConfigArray,
  serializeFretboardConfigArray,
  type FretboardConfig,
} from './fretboard-config.ts';
import { FRETBOARDS_HISTORY_KEY } from './history.ts';

type RuntimeFretboard = {
  /** Stable runtime-only id used for React keys and DnD identity. Not persisted. */
  id: string;
  config: FretboardConfig;
};

const PERSISTED_OPTIONS: HistoryStateOptions<readonly FretboardConfig[]> = {
  serialize: serializeFretboardConfigArray,
  deserialize: deserializeFretboardConfigArray,
};

function makeFretboard(config: FretboardConfig): RuntimeFretboard {
  return {
    id: crypto.randomUUID(),
    config,
  };
}

function loadInitialFretboards(): RuntimeFretboard[] {
  const stored = getStoredValue(FRETBOARDS_HISTORY_KEY, PERSISTED_OPTIONS);
  if (stored && stored.length > 0) {
    return stored.map((config) => makeFretboard(config));
  }
  return [makeFretboard(DEFAULT_FRETBOARD_CONFIG)];
}

/**
 * How long the fade-out animation runs before the panel is actually removed
 * from state. Kept in sync with `$remove-animation-ms` in FretboardPanel.module.scss.
 *
 * @todo Replace this manual two-phase (mark-removing → setTimeout → drop)
 * orchestration with React's `addTransitionType` + `<ViewTransition>` once
 * those APIs ship out of canary. That would let us express the fade
 * declaratively and drive the animation via CSS view transitions instead of
 * coordinating a removing-set, a timer map, and a matching CSS class.
 * See https://react.dev/reference/react/addTransitionType
 */
const REMOVE_ANIMATION_MS = 220;

function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= items.length) return items.slice();
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return items.slice();
  next.splice(Math.max(0, Math.min(to, next.length)), 0, moved);
  return next;
}

export function useFretboards() {
  const [fretboards, setFretboards] = useState<RuntimeFretboard[]>(
    loadInitialFretboards,
  );

  // IDs currently in their fade-out phase. Still rendered so CSS can animate,
  // but marked so the panel can apply the fading class and ignore interactions.
  const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  // Track pending removal timers so an unmount doesn't leave them dangling and
  // so a second removeFretboard(id) for the same id doesn't schedule twice.
  const removeTimersRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const timers = removeTimersRef.current;
    return () => {
      for (const handle of timers.values()) {
        window.clearTimeout(handle);
      }
      timers.clear();
    };
  }, []);

  useEffect(() => {
    // Persist only the panels that aren't mid-removal — otherwise a page
    // refresh during the fade would briefly restore a panel we just deleted.
    storeValue(
      FRETBOARDS_HISTORY_KEY,
      fretboards.filter((f) => !removingIds.has(f.id)).map((f) => f.config),
      PERSISTED_OPTIONS,
    );
  }, [fretboards, removingIds]);

  const updateConfig = useCallback((id: string, next: FretboardConfig) => {
    setFretboards((current) =>
      current.map((f) => (f.id === id ? { ...f, config: next } : f)),
    );
  }, []);

  const insertCopyAt = useCallback(
    (index: number, sourceConfig: FretboardConfig) => {
      setFretboards((current) => {
        const clamped = Math.max(0, Math.min(index, current.length));
        const next = current.slice();
        // structuredClone ensures later edits to one panel don't mutate the
        // copy through any shared nested references (e.g. `pattern` arrays)
        next.splice(clamped, 0, makeFretboard(structuredClone(sourceConfig)));
        return next;
      });
    },
    [],
  );

  const removeFretboard = useCallback((id: string) => {
    // Ignore if already scheduled for removal
    if (removeTimersRef.current.has(id)) return;

    setRemovingIds((ids) => {
      if (ids.has(id)) return ids;
      const next = new Set(ids);
      next.add(id);
      return next;
    });

    const handle = window.setTimeout(() => {
      removeTimersRef.current.delete(id);
      setFretboards((current) => {
        // Always keep at least one panel — the trash button is disabled when
        // there's only one, but guard here too in case of races/programmatic use
        if (current.length <= 1) return current;
        return current.filter((f) => f.id !== id);
      });
      setRemovingIds((ids) => {
        if (!ids.has(id)) return ids;
        const next = new Set(ids);
        next.delete(id);
        return next;
      });
    }, REMOVE_ANIMATION_MS);

    removeTimersRef.current.set(id, handle);
  }, []);

  // Move up/down wrap around: clicking up on the first panel moves it to the
  // end, clicking down on the last panel moves it to the top. Keeps arrows
  // always useful without needing a disabled state.
  const moveUp = useCallback((id: string) => {
    setFretboards((current) => {
      const index = current.findIndex((f) => f.id === id);
      if (index < 0 || current.length <= 1) return current;
      const nextIndex = (index - 1 + current.length) % current.length;
      return moveItem(current, index, nextIndex);
    });
  }, []);

  const moveDown = useCallback((id: string) => {
    setFretboards((current) => {
      const index = current.findIndex((f) => f.id === id);
      if (index < 0 || current.length <= 1) return current;
      const nextIndex = (index + 1) % current.length;
      return moveItem(current, index, nextIndex);
    });
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setFretboards((current) => moveItem(current, fromIndex, toIndex));
  }, []);

  return {
    fretboards,
    removingIds,
    updateConfig,
    insertCopyAt,
    removeFretboard,
    moveUp,
    moveDown,
    reorder,
  };
}
