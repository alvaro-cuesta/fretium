import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { SCALE_ROOT_COLOR, SCALE_TONE_COLOR } from './common';

export const PATTERNS_SCALES = {
  type: 'optgroup',
  displayName: 'Scales',
  entries: {
    major: {
      type: 'pattern',
      displayName: 'Major scale',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', '3', '4', '5', '6', '7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    minor: {
      type: 'pattern',
      displayName: 'Minor scale',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', 'b3', '4', '5', 'b6', 'b7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
  },
} satisfies PatternConfigEntryList;
