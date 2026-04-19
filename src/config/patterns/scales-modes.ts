import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { SCALE_ROOT_COLOR, SCALE_TONE_COLOR } from './common';

export const PATTERNS_SCALES_MODES = {
  type: 'optgroup',
  displayName: 'Scales - Modes',
  entries: {
    lydian: {
      type: 'pattern',
      displayName: 'Lydian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', '3', '#4', '5', '6', '7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    ionian: {
      type: 'pattern',
      displayName: 'Ionian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', '3', '4', '5', '6', '7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    mixolydian: {
      type: 'pattern',
      displayName: 'Mixolydian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', '3', '4', '5', '6', 'b7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    dorian: {
      type: 'pattern',
      displayName: 'Dorian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', 'b3', '4', '5', '6', 'b7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    aeolian: {
      type: 'pattern',
      displayName: 'Aeolian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['2', 'b3', '4', '5', 'b6', 'b7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    phrygian: {
      type: 'pattern',
      displayName: 'Phrygian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['b2', 'b3', '4', '5', 'b6', 'b7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
    locrian: {
      type: 'pattern',
      displayName: 'Locrian',
      rules: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: { interval: ['b2', 'b3', '4', 'b5', 'b6', 'b7'] },
          color: SCALE_TONE_COLOR,
        },
      ],
      isFullOctave: true,
    },
  },
} satisfies PatternConfigEntryList;
