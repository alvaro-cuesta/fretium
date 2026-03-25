import { useCallback } from 'react';
import { useHistoryReducer } from '../../hooks/useHistoryReducer';
import type {
  EndFretValue,
  FretRangeInput,
  StartFretValue,
} from '../../lib/fret-range';
import type { HistoryStateDeserializeResult } from '../../lib/history-state';
import { clamp } from '../../lib/math';
import { MAX_FRET, MIN_FRET, TOTAL_FRETS } from '../../lib/pattern-engine';
import { checkIsNever } from '../../lib/type';
import { HISTORY_STATE_KEYS } from './history';

const DEFAULT_FRET_RANGE: FretRangeInput = {
  start: 'AUTO',
  end: 'AUTO',
};

export const START_FRET_OPTIONS: {
  label: string;
  value: StartFretValue;
}[] = [
  {
    label: 'Auto',
    value: 'AUTO',
  },
  {
    label: 'Auto (avoid open strings)',
    value: 'AUTO_AVOID_OPEN',
  },
  ...Array.from({ length: TOTAL_FRETS }, (_, i) => ({
    label: i.toString(),
    value: i,
  })),
];

export const END_FRET_OPTIONS: {
  label: string;
  value: EndFretValue;
}[] = [
  {
    label: 'Auto',
    value: 'AUTO',
  },
  ...Array.from({ length: TOTAL_FRETS }, (_, i) => ({
    label: i.toString(),
    value: i,
  })),
];

type FretRangeAction =
  | { type: 'SET_START'; start: StartFretValue }
  | { type: 'SET_END'; end: EndFretValue };

function isPersistedFretValue(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_FRET &&
    value <= MAX_FRET
  );
}

function isPersistedStartFretValue(value: unknown): value is StartFretValue {
  return (
    value === 'AUTO' ||
    value === 'AUTO_AVOID_OPEN' ||
    isPersistedFretValue(value)
  );
}

function isPersistedEndFretValue(value: unknown): value is EndFretValue {
  return value === 'AUTO' || isPersistedFretValue(value);
}

function isPersistedFretRangeInput(value: unknown): value is FretRangeInput {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value) ||
    !('start' in value) ||
    !('end' in value)
  ) {
    return false;
  }

  const fretRangeValue = value as {
    start: unknown;
    end: unknown;
  };

  return (
    isPersistedStartFretValue(fretRangeValue.start) &&
    isPersistedEndFretValue(fretRangeValue.end)
  );
}

function fretRangeReducer(
  state: FretRangeInput,
  action: FretRangeAction,
): FretRangeInput {
  switch (action.type) {
    case 'SET_START': {
      const start = action.start;

      return {
        start,
        end:
          start === 'AUTO' ||
          start === 'AUTO_AVOID_OPEN' ||
          state.end === 'AUTO'
            ? state.end
            : clamp(state.end, start, MAX_FRET),
      };
    }
    case 'SET_END': {
      const end = action.end;
      return {
        start:
          end === 'AUTO' ||
          state.start === 'AUTO' ||
          state.start === 'AUTO_AVOID_OPEN'
            ? state.start
            : clamp(state.start, MIN_FRET, end),
        end,
      };
    }
    default: {
      return checkIsNever(action);
    }
  }
}

function serialize(fretRange: FretRangeInput): FretRangeInput {
  return fretRange;
}

function deserialize(
  value: unknown,
): HistoryStateDeserializeResult<FretRangeInput> {
  return isPersistedFretRangeInput(value)
    ? { type: 'success', value }
    : { type: 'error' };
}

export function useFretRangeState() {
  const [state, dispatch] = useHistoryReducer(
    HISTORY_STATE_KEYS.fretRange,
    fretRangeReducer,
    DEFAULT_FRET_RANGE,
    { serialize, deserialize },
  );

  const setStart = useCallback(
    (start: string) => {
      dispatch({
        type: 'SET_START',
        start:
          start === 'AUTO' || start === 'AUTO_AVOID_OPEN'
            ? start
            : Number(start),
      });
    },
    [dispatch],
  );

  const setEnd = useCallback(
    (end: string) => {
      dispatch({
        type: 'SET_END',
        end: end === 'AUTO' ? 'AUTO' : Number(end),
      });
    },
    [dispatch],
  );

  return {
    start: state.start,
    end: state.end,
    setStart,
    setEnd,
  };
}
