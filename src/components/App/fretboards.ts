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
 * How long the fade-out / fade-in animations run. Kept in sync with
 * `$remove-animation-ms` in FretboardPanel.module.scss.
 *
 * @todo Replace this manual two-phase (mark-removing → setTimeout → drop, or
 * mark-inserting → rAF → unmark) orchestration with React's
 * `addTransitionType` + `<ViewTransition>` once those APIs ship out of canary.
 * That would let us express the fade declaratively and drive the animation
 * via CSS view transitions instead of coordinating a set, a timer map, and a
 * matching CSS class.
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

  // IDs freshly inserted and still rendering in their "entering" state for one
  // frame, so the panel starts at opacity 0 / scaled down and CSS can transition
  // to its resting state.
  const [insertingIds, setInsertingIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  // Track pending removal timers so an unmount doesn't leave them dangling and
  // so a second removeFretboard(id) for the same id doesn't schedule twice.
  const removeTimersRef = useRef<Map<string, number>>(new Map());
  // Track pending insertion rAF handles so we can cancel them on unmount.
  const insertFramesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const timers = removeTimersRef.current;
    const frames = insertFramesRef.current;
    return () => {
      for (const handle of timers.values()) {
        window.clearTimeout(handle);
      }
      timers.clear();
      for (const handle of frames) {
        window.cancelAnimationFrame(handle);
      }
      frames.clear();
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
      // Generate the id up front so we can flag it as inserting in the same
      // batch that adds it to the fretboards array.
      const newFretboard: RuntimeFretboard = {
        id: crypto.randomUUID(),
        // structuredClone ensures later edits to one panel don't mutate the
        // copy through any shared nested references (e.g. `pattern` arrays)
        config: structuredClone(sourceConfig),
      };

      setInsertingIds((ids) => {
        const next = new Set(ids);
        next.add(newFretboard.id);
        return next;
      });

      setFretboards((current) => {
        const clamped = Math.max(0, Math.min(index, current.length));
        const next = current.slice();
        next.splice(clamped, 0, newFretboard);
        return next;
      });

      // Wait two animation frames before clearing the inserting flag. The first
      // frame lets React commit and the browser paint the panel in its
      // entering state (opacity 0 / scale 0.96); the second frame ensures that
      // paint actually landed so the class-removal triggers a real CSS
      // transition instead of being collapsed with the initial render.
      const firstFrame = window.requestAnimationFrame(() => {
        insertFramesRef.current.delete(firstFrame);
        const secondFrame = window.requestAnimationFrame(() => {
          insertFramesRef.current.delete(secondFrame);
          setInsertingIds((ids) => {
            if (!ids.has(newFretboard.id)) return ids;
            const next = new Set(ids);
            next.delete(newFretboard.id);
            return next;
          });
        });
        insertFramesRef.current.add(secondFrame);
      });
      insertFramesRef.current.add(firstFrame);
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
    insertingIds,
    updateConfig,
    insertCopyAt,
    removeFretboard,
    moveUp,
    moveDown,
    reorder,
  };
}
