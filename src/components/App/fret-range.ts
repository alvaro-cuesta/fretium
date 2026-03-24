import { useCallback, useReducer } from 'react';
import type {
  EndFretValue,
  FretRangeInput,
  StartFretValue,
} from '../../lib/fret-range';
import { clamp } from '../../lib/math';
import { MAX_FRET, MIN_FRET, TOTAL_FRETS } from '../../lib/pattern-engine';
import { checkIsNever } from '../../lib/type';

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

export function useFretRangeState() {
  const [state, dispatch] = useReducer(fretRangeReducer, {
    start: 'AUTO',
    end: 'AUTO',
  });

  const setStart = useCallback((start: string) => {
    dispatch({
      type: 'SET_START',
      start:
        start === 'AUTO' || start === 'AUTO_AVOID_OPEN' ? start : Number(start),
    });
  }, []);

  const setEnd = useCallback((end: string) => {
    dispatch({
      type: 'SET_END',
      end: end === 'AUTO' ? 'AUTO' : Number(end),
    });
  }, []);

  return {
    start: state.start,
    end: state.end,
    setStart,
    setEnd,
  };
}
