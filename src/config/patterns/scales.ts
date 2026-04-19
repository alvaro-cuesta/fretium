import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { ALT_OPACITY, SCALE_ROOT_COLOR, SCALE_TONE_COLOR } from './common';

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
              rules: [
                {
                  condition: { string: 6 },
                  children: [
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    {
                      condition: { interval: ['7', '2'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { interval: ['3', '4', '5'], string: 5 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 4 },
                  children: [
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
                {
                  condition: { interval: ['2', '3', '4'], string: 3 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { interval: ['5', '6'], string: 2 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 1 },
                  children: [
                    {
                      condition: { interval: ['7', '2'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
              ],
            },
            ed: {
              type: 'pattern',
              displayName: 'E-D position',
              rules: [
                {
                  condition: { string: 6 },
                  children: [
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    {
                      condition: { interval: ['2', '3'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { interval: ['4', '5', '6'], string: 5 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 4 },
                  children: [
                    {
                      condition: { interval: ['7', '2'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
                {
                  condition: { string: 3 },
                  children: [
                    {
                      condition: { interval: ['3', '4'] },
                      color: SCALE_TONE_COLOR,
                    },
                    {
                      condition: { interval: '5' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 2 },
                  children: [
                    {
                      condition: { interval: '5' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { string: 1 },
                  children: [
                    {
                      condition: { interval: ['2', '3'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
              ],
            },
            d: {
              type: 'pattern',
              displayName: 'D position',
              rules: [
                {
                  condition: { interval: ['2', '3', '4'], string: 6 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 5 },
                  children: [
                    {
                      condition: { interval: ['5', '6'] },
                      color: SCALE_TONE_COLOR,
                    },
                    {
                      condition: { interval: '7' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 4 },
                  children: [
                    {
                      condition: { interval: '7' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    { condition: { interval: '2' }, color: SCALE_TONE_COLOR },
                    {
                      condition: { interval: '3' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 3 },
                  children: [
                    {
                      condition: { interval: '3' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    {
                      condition: { interval: ['4', '5'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { string: 2 },
                  children: [
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
                {
                  condition: { interval: ['2', '3', '4'], string: 1 },
                  color: SCALE_TONE_COLOR,
                },
              ],
            },
            c: {
              type: 'pattern',
              displayName: 'C position',
              rules: [
                {
                  condition: { interval: ['3', '4', '5'], string: 6 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 5 },
                  children: [
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
                {
                  condition: { interval: ['2', '3', '4'], string: 4 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 3 },
                  children: [
                    {
                      condition: { interval: ['5', '6'] },
                      color: SCALE_TONE_COLOR,
                    },
                    {
                      condition: { interval: '7' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 2 },
                  children: [
                    {
                      condition: { interval: '7' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    { condition: { interval: '2' }, color: SCALE_TONE_COLOR },
                  ],
                },
                {
                  condition: { interval: ['3', '4', '5'], string: 1 },
                  color: SCALE_TONE_COLOR,
                },
              ],
            },
            a: {
              type: 'pattern',
              displayName: 'A position',
              rules: [
                {
                  condition: { interval: ['4', '5', '6'], string: 6 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 5 },
                  children: [
                    { condition: { interval: '7' }, color: SCALE_TONE_COLOR },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    { condition: { interval: '2' }, color: SCALE_TONE_COLOR },
                  ],
                },
                {
                  condition: { interval: ['3', '4', '5'], string: 4 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 3 },
                  children: [
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                    {
                      condition: { interval: '1' },
                      color: SCALE_ROOT_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 2 },
                  children: [
                    {
                      condition: { interval: '1' },
                      color: SCALE_ROOT_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    {
                      condition: { interval: ['2', '3'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { interval: ['4', '5', '6'], string: 1 },
                  color: SCALE_TONE_COLOR,
                },
              ],
            },
            ag: {
              type: 'pattern',
              displayName: 'A-G position',
              rules: [
                {
                  condition: { interval: ['5', '6', '7'], string: 6 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 5 },
                  children: [
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    {
                      condition: { interval: ['2', '3'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { interval: ['4', '5', '6'], string: 4 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 3 },
                  children: [
                    { condition: { interval: '7' }, color: SCALE_TONE_COLOR },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    {
                      condition: { interval: '2' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 2 },
                  children: [
                    {
                      condition: { interval: '2' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    {
                      condition: { interval: ['3', '4'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { interval: ['5', '6', '7'], string: 1 },
                  color: SCALE_TONE_COLOR,
                },
              ],
            },
            g: {
              type: 'pattern',
              displayName: 'G position',
              rules: [
                {
                  condition: { string: 6 },
                  children: [
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
                {
                  condition: { interval: ['2', '3', '4'], string: 5 },
                  color: SCALE_TONE_COLOR,
                },
                {
                  condition: { string: 4 },
                  children: [
                    {
                      condition: { interval: ['5', '6'] },
                      color: SCALE_TONE_COLOR,
                    },
                    {
                      condition: { interval: '7' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 3 },
                  children: [
                    {
                      condition: { interval: '7' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                    { condition: { interval: '2' }, color: SCALE_TONE_COLOR },
                    {
                      condition: { interval: '3' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                  ],
                },
                {
                  condition: { string: 2 },
                  children: [
                    {
                      condition: { interval: '3' },
                      color: SCALE_TONE_COLOR,
                      opacity: ALT_OPACITY,
                    },
                    {
                      condition: { interval: ['4', '5'] },
                      color: SCALE_TONE_COLOR,
                    },
                  ],
                },
                {
                  condition: { string: 1 },
                  children: [
                    {
                      condition: { interval: ['6', '7'] },
                      color: SCALE_TONE_COLOR,
                    },
                    { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
                  ],
                },
              ],
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
