import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { SCALE_ROOT_COLOR, SCALE_TONE_COLOR } from './common';

export const PATTERNS_OCTATONIC = {
  type: 'sublist',
  displayName: 'Octatonic',
  entries: {
    'whole-half': {
      type: 'pattern',
      displayName: 'Whole-Half diminished',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: {
            interval: ['2', 'b3', '4', 'b5', 'b6', '6', '7'],
          },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    'half-whole': {
      type: 'pattern',
      displayName: 'Half-Whole diminished',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: {
            interval: ['b2', 'b3', '3', 'b5', '5', '6', 'b7'],
          },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
  },
} as const satisfies PatternConfigEntryList;
