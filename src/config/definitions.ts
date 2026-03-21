import type { KeysOfUnion } from 'type-fest';
import { objectValues } from '../../lib/object';
import type { FretboardNoteColor } from '../components/Fretboard/theme';
import type { RuleDefinition } from '../lib/rule-engine';

const ALT_OPACITY = 0.25;

const CHORD_ROOT_COLOR = '1-STRONG' as const;
const CHORD_TONE_COLOR = '2-STRONG' as const;

const SCALE_ROOT_COLOR = '1-LIGHT' as const;
const SCALE_TONE_COLOR = '2-LIGHT' as const;

function makeMaj7Arpeggio_GPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: '7' }, color: toneColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: '3' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '7' }, color: toneColor },
    { condition: { string: 5, interval: ['3', '5'] }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function makeMaj7Arpeggio_EPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: '3' }, color: toneColor },
    { condition: { string: 2, interval: '7' }, color: toneColor },
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
    { condition: { string: 3, interval: '3' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '7' }, color: toneColor },
    { condition: { string: 5, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: '3' }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function makeMaj7Arpeggio_DPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '3' }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: '7' }, color: toneColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '3' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: ['5', '7'] }, color: toneColor },
    { condition: { string: 6, interval: '3' }, color: toneColor },
  ] as const;
}

function makeMaj7Arpeggio_CPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: ['3', '5'] }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    {
      condition: { string: 2, interval: '7' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 3, interval: '7' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '3' }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: '7' }, color: toneColor },
    { condition: { string: 6, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: '3' }, color: toneColor },
  ] as const;
}

function makeMaj7Arpeggio_APosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: ['5', '7'] }, color: toneColor },
    { condition: { string: 2, interval: '3' }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: '7' }, color: toneColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: '3' }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: ['5', '7'] }, color: toneColor },
  ] as const;
}

function makeMaj7Arpeggio_AGPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: '7' }, color: toneColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    {
      condition: { string: 2, interval: '3' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 3, interval: '3' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    {
      condition: { string: 3, interval: '7' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 4, interval: '7' },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: '3' }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: '7' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_6432_RootPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: '3' }, color: toneColor },
    { condition: { string: 4, interval: '7' }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function makeMaj7Chord_6432_1stInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '7' }, color: toneColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: '3' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_6432_2ndInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: '7' }, color: toneColor },
    { condition: { string: 4, interval: '3' }, color: toneColor },
    { condition: { string: 6, interval: '5' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_6432_3rdInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '3' }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 6, interval: '7' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_5432_RootPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '3' }, color: toneColor },
    { condition: { string: 3, interval: '7' }, color: toneColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}

function makeMaj7Chord_5432_1stInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '7' }, color: toneColor },
    { condition: { string: 5, interval: '3' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_5432_2ndInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '7' }, color: toneColor },
    { condition: { string: 3, interval: '3' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: '5' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_5432_3rdInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '3' }, color: toneColor },
    { condition: { string: 5, interval: '7' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_4321_RootPosition(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '3' }, color: toneColor },
    { condition: { string: 2, interval: '7' }, color: toneColor },
    { condition: { string: 3, interval: '5' }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
  ] as const;
}

function makeMaj7Chord_4321_1stInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '5' }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: '7' }, color: toneColor },
    { condition: { string: 4, interval: '3' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_4321_2ndInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '7' }, color: toneColor },
    { condition: { string: 2, interval: '3' }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: '5' }, color: toneColor },
  ] as const;
}

function makeMaj7Chord_4321_3rdInversion(
  rootColor: FretboardNoteColor,
  toneColor: FretboardNoteColor,
) {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: '5' }, color: toneColor },
    { condition: { string: 3, interval: '3' }, color: toneColor },
    { condition: { string: 4, interval: '7' }, color: toneColor },
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
      ...makeMaj7Arpeggio_GPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (G position) + 6-4-3-2 (root position)': [
      ...makeMaj7Arpeggio_GPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_RootPosition(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (G position) + 4-3-2-1 (3rd inversion)': [
      ...makeMaj7Arpeggio_GPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position)': [
      ...makeMaj7Arpeggio_EPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position) + Left 6-4-3-2 (root position)': [
      ...makeMaj7Arpeggio_EPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_RootPosition(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position) + Left 4-3-2-1 (3rd inversion)': [
      ...makeMaj7Arpeggio_EPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position) + 5-4-3-2 (2nd inversion)': [
      ...makeMaj7Arpeggio_EPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_5432_2ndInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position) + Right 6-4-3-2 (1st inversion)': [
      ...makeMaj7Arpeggio_EPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_1stInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (E position) + Right 4-3-2-1 (root position)': [
      ...makeMaj7Arpeggio_EPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_RootPosition(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (D position)': [
      ...makeMaj7Arpeggio_DPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (D position) + 6-4-3-2 (1st inversion)': [
      ...makeMaj7Arpeggio_DPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_1stInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (D position) + 5-4-3-2 (3rd inversion)': [
      ...makeMaj7Arpeggio_DPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_5432_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (D position) + 4-3-2-1 (root position)': [
      ...makeMaj7Arpeggio_DPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_RootPosition(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (C position)': [
      ...makeMaj7Arpeggio_CPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (C position) + 6-4-3-2 (2nd inversion)': [
      ...makeMaj7Arpeggio_CPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_2ndInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (C position) + 5-4-3-2 (3rd inversion)': [
      ...makeMaj7Arpeggio_CPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_5432_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (C position) + 4-3-2-1 (1st inversion)': [
      ...makeMaj7Arpeggio_CPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_1stInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A position)': [
      ...makeMaj7Arpeggio_APosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A position) + 6-4-3-2 (3rd inversion)': [
      ...makeMaj7Arpeggio_APosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A position) + 5-4-3-2 (root position)': [
      ...makeMaj7Arpeggio_APosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_5432_RootPosition(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A position) + 4-3-2-1 (2nd inversion)': [
      ...makeMaj7Arpeggio_APosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_2ndInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position)': [
      ...makeMaj7Arpeggio_AGPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position) + Left 6-4-3-2 (3rd inversion)': [
      ...makeMaj7Arpeggio_AGPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position) + Left 4-3-2-1 (2nd inversion)': [
      ...makeMaj7Arpeggio_AGPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_2ndInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position) + 5-4-3-2 (1st inversion)': [
      ...makeMaj7Arpeggio_AGPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_5432_1stInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position) + Right 6-4-3-2 (root position)': [
      ...makeMaj7Arpeggio_AGPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_6432_RootPosition(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
    'Maj7 Arpeggio (A-G position) + Right 4-3-2-1 (3rd inversion)': [
      ...makeMaj7Arpeggio_AGPosition(SCALE_ROOT_COLOR, SCALE_TONE_COLOR),
      ...makeMaj7Chord_4321_3rdInversion(CHORD_ROOT_COLOR, CHORD_TONE_COLOR),
    ],
  },
  'Chords - Maj7': {
    'Maj7 Chord Drop 3 (Bass 6th) | 6-4-3-2 ': [
      ...makeMaj7Chord_6432_RootPosition('1-STRONG', '1-LIGHT'),
      ...makeMaj7Chord_6432_1stInversion('2-STRONG', '2-LIGHT'),
      ...makeMaj7Chord_6432_2ndInversion('3-STRONG', '3-LIGHT'),
      ...makeMaj7Chord_6432_3rdInversion('4-STRONG', '4-LIGHT'),
    ],
    'Maj7 Chord Drop 2 (Bass 5th) | 5-4-3-2 ': [
      ...makeMaj7Chord_5432_RootPosition('1-STRONG', '1-LIGHT'),
      ...makeMaj7Chord_5432_1stInversion('2-STRONG', '2-LIGHT'),
      ...makeMaj7Chord_5432_2ndInversion('3-STRONG', '3-LIGHT'),
      ...makeMaj7Chord_5432_3rdInversion('4-STRONG', '4-LIGHT'),
    ],
    'Maj7 Chord Drop 2 (Bass 4th) | 4-3-2-1 ': [
      ...makeMaj7Chord_4321_RootPosition('1-STRONG', '1-LIGHT'),
      ...makeMaj7Chord_4321_1stInversion('2-STRONG', '2-LIGHT'),
      ...makeMaj7Chord_4321_2ndInversion('3-STRONG', '3-LIGHT'),
      ...makeMaj7Chord_4321_3rdInversion('4-STRONG', '4-LIGHT'),
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
