import type { KeysOfUnion } from 'type-fest';
import { objectValues } from '../../lib/object';
import type { FretboardNoteColor } from '../components/Fretboard/theme';
import type { RuleDefinition } from '../lib/rule-engine';

const ALT_OPACITY = 0.25;

const CHORD_ROOT_COLOR = '1-STRONG' as const;
const CHORD_TONE_COLOR = '2-STRONG' as const;

const SCALE_ROOT_COLOR = '1-LIGHT' as const;
const SCALE_TONE_COLOR = '2-LIGHT' as const;

type SeventhInterval = '7' | 'b7';
type ThirdInterval = '3' | 'b3';

function make7Arpeggio_GPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    {
      condition: { string: 5, interval: [thirdInterval, '5'] },
      color: toneColor,
    },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Arpeggio_EPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    {
      condition: { string: 2, interval: '5' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 3, interval: '5' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Arpeggio_DPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    {
      condition: { string: 5, interval: ['5', seventhInterval] },
      color: toneColor,
    },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Arpeggio_CPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    {
      condition: { string: 1, interval: [thirdInterval, '5'] },
      color: toneColor,
    },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    {
      condition: { string: 2, interval: seventhInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 3, interval: seventhInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Arpeggio_APosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    {
      condition: { string: 1, interval: ['5', seventhInterval] },
      color: toneColor,
    },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    {
      condition: { string: 6, interval: ['5', seventhInterval] },
      color: toneColor,
    },
  ] as const;
}

function make7Arpeggio_AGPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    {
      condition: { string: 2, interval: thirdInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 3, interval: thirdInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    {
      condition: { string: 3, interval: seventhInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 4, interval: seventhInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6432_RootPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_6432_1stInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6432_2ndInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: '5' }, color: toneColor },
  ] as const;
}

function make7Chord_6432_3rdInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5321_RootPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '5' }, color: toneColor },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_5321_1stInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5321_2ndInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '5' }, color: toneColor },
  ] as const;
}

function make7Chord_5321_3rdInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6543_RootPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_6543_1stInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6543_2ndInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: '5' }, color: toneColor },
  ] as const;
}

function make7Chord_6543_3rdInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5432_RootPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_5432_1stInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5432_2ndInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: '5' }, color: toneColor },
  ] as const;
}

function make7Chord_5432_3rdInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_4321_RootPosition(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_4321_1stInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '5' }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_4321_2ndInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
  ] as const;
}

function make7Chord_4321_3rdInversion(
  thirdInterval: ThirdInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
  ] as const;
}

export const DEFINITIONS_GROUPED = {
  Scales: {
    'Major scale': [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', '3', '4', '5', '6', '7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    'Minor scale': [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', 'b3', '4', '5', 'b6', 'b7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
  },
  'Scales - Modes': {
    Lydian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', '3', '#4', '5', '6', '7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    Ionian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', '3', '4', '5', '6', '7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    Mixolydian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', '3', '4', '5', '6', 'b7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    Dorian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', 'b3', '4', '5', '6', 'b7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    Aeolian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['2', 'b3', '4', '5', 'b6', 'b7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    Phrygian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['b2', 'b3', '4', '5', 'b6', 'b7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
    Locrian: [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      {
        condition: { interval: ['b2', 'b3', '4', 'b5', 'b6', 'b7'] },
        color: SCALE_TONE_COLOR,
      },
    ],
  },
  'Arpeggios - Maj7': {
    'Maj7 Arpeggio': [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      { condition: { interval: ['3', '5', '7'] }, color: SCALE_TONE_COLOR },
    ],
    'Maj7 Arpeggio (G position)': [
      ...make7Arpeggio_GPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (G position) + 6-4-3-2 (root position)': [
      ...make7Arpeggio_GPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (G position) + 6-5-4-3 (root position)': [
      ...make7Arpeggio_GPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (G position) + 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_GPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position) + Left 6-4-3-2 (root position)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position) + Left 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position) + 6-5-4-3 (root position)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position) + 5-4-3-2 (2nd inversion)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_2ndInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position) + 5-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_2ndInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position) + Right 6-4-3-2 (1st inversion)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_1stInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (E position) + Right 4-3-2-1 (root position)': [
      ...make7Arpeggio_EPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (D position)': [
      ...make7Arpeggio_DPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (D position) + 6-4-3-2 (1st inversion)': [
      ...make7Arpeggio_DPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_1stInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (D position) + 6-5-4-3 (1st inversion)': [
      ...make7Arpeggio_DPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_1stInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (D position) + 5-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_DPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (D position) + 5-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_DPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (D position) + 4-3-2-1 (root position)': [
      ...make7Arpeggio_DPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (C position)': [
      ...make7Arpeggio_CPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (C position) + 6-4-3-2 (2nd inversion)': [
      ...make7Arpeggio_CPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_2ndInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (C position) + 6-5-4-3 (2nd inversion)': [
      ...make7Arpeggio_CPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_2ndInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (C position) + 5-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_CPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (C position) + 5-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_CPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (C position) + 4-3-2-1 (1st inversion)': [
      ...make7Arpeggio_CPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_1stInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A position)': [
      ...make7Arpeggio_APosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A position) + 6-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_APosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A position) + 6-5-4-3 (3rd inversion)': [
      ...make7Arpeggio_APosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A position) + 5-4-3-2 (root position)': [
      ...make7Arpeggio_APosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A position) + 5-3-2-1 (root position)': [
      ...make7Arpeggio_APosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A position) + 4-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_APosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_2ndInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position) + Left 6-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position) + Left 4-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_2ndInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position) + 6-5-4-3 (3rd inversion)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position) + 5-4-3-2 (1st inversion)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_1stInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position) + 5-3-2-1 (1st inversion)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_1stInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position) + Right 6-4-3-2 (root position)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_RootPosition(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'Maj7 Arpeggio (A-G position) + Right 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_AGPosition('3', '7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_3rdInversion(
        '3',
        '7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
  },
  'Arpeggios - 7': {
    '7 Arpeggio': [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      { condition: { interval: ['3', '5', 'b7'] }, color: SCALE_TONE_COLOR },
    ],
    '7 Arpeggio (G position)': [
      ...make7Arpeggio_GPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    '7 Arpeggio (G position) + 6-4-3-2 (root position)': [
      ...make7Arpeggio_GPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (G position) + 6-5-4-3 (root position)': [
      ...make7Arpeggio_GPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (G position) + 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_GPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    '7 Arpeggio (E position) + Left 6-4-3-2 (root position)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position) + Left 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position) + 6-5-4-3 (root position)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position) + 5-4-3-2 (2nd inversion)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_2ndInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position) + 5-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_2ndInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position) + Right 6-4-3-2 (1st inversion)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_1stInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (E position) + Right 4-3-2-1 (root position)': [
      ...make7Arpeggio_EPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (D position)': [
      ...make7Arpeggio_DPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    '7 Arpeggio (D position) + 6-4-3-2 (1st inversion)': [
      ...make7Arpeggio_DPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_1stInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (D position) + 6-5-4-3 (1st inversion)': [
      ...make7Arpeggio_DPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_1stInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (D position) + 5-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_DPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (D position) + 5-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_DPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (D position) + 4-3-2-1 (root position)': [
      ...make7Arpeggio_DPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (C position)': [
      ...make7Arpeggio_CPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    '7 Arpeggio (C position) + 6-4-3-2 (2nd inversion)': [
      ...make7Arpeggio_CPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_2ndInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (C position) + 6-5-4-3 (2nd inversion)': [
      ...make7Arpeggio_CPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_2ndInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (C position) + 5-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_CPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (C position) + 5-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_CPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (C position) + 4-3-2-1 (1st inversion)': [
      ...make7Arpeggio_CPosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_1stInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A position)': [
      ...make7Arpeggio_APosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    '7 Arpeggio (A position) + 6-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_APosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6432_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A position) + 6-5-4-3 (3rd inversion)': [
      ...make7Arpeggio_APosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_6543_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A position) + 5-4-3-2 (root position)': [
      ...make7Arpeggio_APosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5432_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A position) + 5-3-2-1 (root position)': [
      ...make7Arpeggio_APosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_5321_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A position) + 4-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_APosition('3', 'b7', SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...make7Chord_4321_2ndInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + Left 6-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + Left 4-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_2ndInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + 6-5-4-3 (3rd inversion)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + 5-4-3-2 (1st inversion)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5432_1stInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + 5-3-2-1 (1st inversion)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5321_1stInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + Right 6-4-3-2 (root position)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_RootPosition(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    '7 Arpeggio (A-G position) + Right 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_AGPosition(
        '3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_3rdInversion(
        '3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
  },
  'Arpeggios - min7': {
    'min7 Arpeggio': [
      { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
      { condition: { interval: ['b3', '5', 'b7'] }, color: SCALE_TONE_COLOR },
    ],
    'min7 Arpeggio (G position)': [
      ...make7Arpeggio_GPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (G position) + 6-4-3-2 (root position)': [
      ...make7Arpeggio_GPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (G position) + 6-5-4-3 (root position)': [
      ...make7Arpeggio_GPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (G position) + 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_GPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + Left 6-4-3-2 (root position)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + Left 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + 6-5-4-3 (root position)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + 5-4-3-2 (2nd inversion)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5432_2ndInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + 5-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5321_2ndInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + Right 6-4-3-2 (1st inversion)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_1stInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (E position) + Right 4-3-2-1 (root position)': [
      ...make7Arpeggio_EPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (D position)': [
      ...make7Arpeggio_DPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (D position) + 6-4-3-2 (1st inversion)': [
      ...make7Arpeggio_DPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_1stInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (D position) + 6-5-4-3 (1st inversion)': [
      ...make7Arpeggio_DPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_1stInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (D position) + 5-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_DPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5432_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (D position) + 5-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_DPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5321_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (D position) + 4-3-2-1 (root position)': [
      ...make7Arpeggio_DPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (C position)': [
      ...make7Arpeggio_CPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (C position) + 6-4-3-2 (2nd inversion)': [
      ...make7Arpeggio_CPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_2ndInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (C position) + 6-5-4-3 (2nd inversion)': [
      ...make7Arpeggio_CPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_2ndInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (C position) + 5-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_CPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5432_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (C position) + 5-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_CPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5321_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (C position) + 4-3-2-1 (1st inversion)': [
      ...make7Arpeggio_CPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_1stInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A position)': [
      ...make7Arpeggio_APosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A position) + 6-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_APosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A position) + 6-5-4-3 (3rd inversion)': [
      ...make7Arpeggio_APosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A position) + 5-4-3-2 (root position)': [
      ...make7Arpeggio_APosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5432_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A position) + 5-3-2-1 (root position)': [
      ...make7Arpeggio_APosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5321_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A position) + 4-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_APosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_2ndInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + Left 6-4-3-2 (3rd inversion)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + Left 4-3-2-1 (2nd inversion)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_2ndInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + 6-5-4-3 (3rd inversion)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6543_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + 5-4-3-2 (1st inversion)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5432_1stInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + 5-3-2-1 (1st inversion)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_5321_1stInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + Right 6-4-3-2 (root position)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_6432_RootPosition(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
    'min7 Arpeggio (A-G position) + Right 4-3-2-1 (3rd inversion)': [
      ...make7Arpeggio_AGPosition(
        'b3',
        'b7',
        SCALE_ROOT_COLOR,
        SCALE_TONE_COLOR,
      ),
      ...make7Chord_4321_3rdInversion(
        'b3',
        'b7',
        CHORD_ROOT_COLOR,
        CHORD_TONE_COLOR,
      ),
    ],
  },
  'Chords - Maj7': {
    'Maj7 Chord Drop 3 (Bass 6th) | 6-4-3-2 ': [
      ...make7Chord_6432_RootPosition('3', '7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_6432_1stInversion('3', '7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_6432_2ndInversion('3', '7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_6432_3rdInversion('3', '7', '4-STRONG', '4-LIGHT'),
    ],
    'Maj7 Chord Drop 3 (Bass 5th) | 5-3-2-1 ': [
      ...make7Chord_5321_RootPosition('3', '7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_5321_1stInversion('3', '7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_5321_2ndInversion('3', '7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_5321_3rdInversion('3', '7', '4-STRONG', '4-LIGHT'),
    ],
    'Maj7 Chord Drop 2 (Bass 6th) | 6-5-4-3 ': [
      ...make7Chord_6543_RootPosition('3', '7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_6543_1stInversion('3', '7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_6543_2ndInversion('3', '7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_6543_3rdInversion('3', '7', '4-STRONG', '4-LIGHT'),
    ],
    'Maj7 Chord Drop 2 (Bass 5th) | 5-4-3-2 ': [
      ...make7Chord_5432_RootPosition('3', '7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_5432_1stInversion('3', '7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_5432_2ndInversion('3', '7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_5432_3rdInversion('3', '7', '4-STRONG', '4-LIGHT'),
    ],
    'Maj7 Chord Drop 2 (Bass 4th) | 4-3-2-1 ': [
      ...make7Chord_4321_RootPosition('3', '7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_4321_1stInversion('3', '7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_4321_2ndInversion('3', '7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_4321_3rdInversion('3', '7', '4-STRONG', '4-LIGHT'),
    ],
  },
  'Chords - 7': {
    '7 Chord Drop 3 (Bass 6th) | 6-4-3-2 ': [
      ...make7Chord_6432_RootPosition('3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_6432_1stInversion('3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_6432_2ndInversion('3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_6432_3rdInversion('3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    '7 Chord Drop 3 (Bass 5th) | 5-3-2-1 ': [
      ...make7Chord_5321_RootPosition('3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_5321_1stInversion('3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_5321_2ndInversion('3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_5321_3rdInversion('3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    '7 Chord Drop 2 (Bass 6th) | 6-5-4-3 ': [
      ...make7Chord_6543_RootPosition('3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_6543_1stInversion('3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_6543_2ndInversion('3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_6543_3rdInversion('3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    '7 Chord Drop 2 (Bass 5th) | 5-4-3-2 ': [
      ...make7Chord_5432_RootPosition('3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_5432_1stInversion('3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_5432_2ndInversion('3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_5432_3rdInversion('3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    '7 Chord Drop 2 (Bass 4th) | 4-3-2-1 ': [
      ...make7Chord_4321_RootPosition('3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_4321_1stInversion('3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_4321_2ndInversion('3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_4321_3rdInversion('3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
  },
  'Chords - min7': {
    'min7 Chord Drop 3 (Bass 6th) | 6-4-3-2 ': [
      ...make7Chord_6432_RootPosition('b3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_6432_1stInversion('b3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_6432_2ndInversion('b3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_6432_3rdInversion('b3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    'min7 Chord Drop 3 (Bass 5th) | 5-3-2-1 ': [
      ...make7Chord_5321_RootPosition('b3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_5321_1stInversion('b3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_5321_2ndInversion('b3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_5321_3rdInversion('b3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    'min7 Chord Drop 2 (Bass 6th) | 6-5-4-3 ': [
      ...make7Chord_6543_RootPosition('b3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_6543_1stInversion('b3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_6543_2ndInversion('b3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_6543_3rdInversion('b3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    'min7 Chord Drop 2 (Bass 5th) | 5-4-3-2 ': [
      ...make7Chord_5432_RootPosition('b3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_5432_1stInversion('b3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_5432_2ndInversion('b3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_5432_3rdInversion('b3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
    'min7 Chord Drop 2 (Bass 4th) | 4-3-2-1 ': [
      ...make7Chord_4321_RootPosition('b3', 'b7', '1-STRONG', '1-LIGHT'),
      ...make7Chord_4321_1stInversion('b3', 'b7', '2-STRONG', '2-LIGHT'),
      ...make7Chord_4321_2ndInversion('b3', 'b7', '3-STRONG', '3-LIGHT'),
      ...make7Chord_4321_3rdInversion('b3', 'b7', '4-STRONG', '4-LIGHT'),
    ],
  },
} as const satisfies Record<string, Record<string, RuleDefinition>>;

export type DefinitionGroupName = keyof typeof DEFINITIONS_GROUPED;

export type DefinitionPresetName = KeysOfUnion<
  (typeof DEFINITIONS_GROUPED)[DefinitionGroupName]
>;

// Flatten for easy lookup
export const DEFINITIONS = objectValues(DEFINITIONS_GROUPED).reduce<
  Record<DefinitionPresetName, RuleDefinition>
>(
  (acc, group) => ({ ...acc, ...group }),
  {} as Record<DefinitionPresetName, RuleDefinition>,
);
