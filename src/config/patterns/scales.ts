import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { SCALE_ROOT_COLOR, SCALE_TONE_COLOR } from './common';
import {
  makeCaged_AGPosition,
  makeCaged_APosition,
  makeCaged_CPosition,
  makeCaged_DPosition,
  makeCaged_EDPosition,
  makeCaged_EPosition,
  makeCaged_GPosition,
} from './common-builders/caged';

const cagedOptions = {
  secondInterval: '2',
  thirdInterval: '3',
  fourthInterval: '4',
  fifthInterval: '5',
  sixthInterval: '6',
  seventhInterval: '7',
  rootColor: SCALE_ROOT_COLOR,
  toneColor: SCALE_TONE_COLOR,
} as const;

export const PATTERNS_SCALES = {
  type: 'optgroup',
  displayName: 'Scales',
  entries: {
    major: {
      type: 'sublist',
      displayName: 'Major scale',
      entries: {
        full: {
          type: 'pattern',
          displayName: 'Full',
          rules: [
            { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
            {
              condition: { interval: ['2', '3', '4', '5', '6', '7'] },
              color: SCALE_TONE_COLOR,
            },
          ],
          isFullOctave: true,
        },
        positions: {
          type: 'optgroup',
          displayName: 'Positions',
          entries: {
            e: {
              type: 'pattern',
              displayName: 'E position',
              rules: makeCaged_EPosition(cagedOptions),
            },
            ed: {
              type: 'pattern',
              displayName: 'E-D position',
              rules: makeCaged_EDPosition(cagedOptions),
            },
            d: {
              type: 'pattern',
              displayName: 'D position',
              rules: makeCaged_DPosition(cagedOptions),
            },
            c: {
              type: 'pattern',
              displayName: 'C position',
              rules: makeCaged_CPosition(cagedOptions),
            },
            a: {
              type: 'pattern',
              displayName: 'A position',
              rules: makeCaged_APosition(cagedOptions),
            },
            ag: {
              type: 'pattern',
              displayName: 'A-G position',
              rules: makeCaged_AGPosition(cagedOptions),
            },
            g: {
              type: 'pattern',
              displayName: 'G position',
              rules: makeCaged_GPosition(cagedOptions),
            },
          },
        },
      },
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
