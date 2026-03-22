import type { KeysOfUnion } from 'type-fest';
import { objectValues } from '../../lib/object';
import type { FretboardNoteColorName } from '../components/Fretboard/theme';
import type { Pattern, PatternRule } from '../lib/pattern-engine';

const ALT_OPACITY = 0.25;

const CHORD_ROOT_COLOR = '1-STRONG' as const;
const CHORD_TONE_COLOR = '2-STRONG' as const;

const SCALE_ROOT_COLOR = '1-LIGHT' as const;
const SCALE_TONE_COLOR = '2-LIGHT' as const;

type ThirdInterval = '3' | 'b3';
type FifthInterval = '5' | 'b5';
type SeventhInterval = '7' | 'b7' | 'bb7';

function make7Arpeggio_GPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    {
      condition: { string: 5, interval: [thirdInterval, fifthInterval] },
      color: toneColor,
    },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Arpeggio_EPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    {
      condition: { string: 2, interval: fifthInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 3, interval: fifthInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Arpeggio_DPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    {
      condition: { string: 5, interval: [fifthInterval, seventhInterval] },
      color: toneColor,
    },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Arpeggio_CPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    {
      condition: { string: 1, interval: [thirdInterval, fifthInterval] },
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
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: fifthInterval }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Arpeggio_CAPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    {
      condition: { string: 1, interval: [fifthInterval, seventhInterval] },
      color: toneColor,
    },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    {
      condition: { string: 6, interval: [thirdInterval, fifthInterval] },
      color: toneColor,
    },
  ] as const;
}

function make7Arpeggio_APosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    {
      condition: { string: 1, interval: [fifthInterval, seventhInterval] },
      color: toneColor,
    },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    {
      condition: { string: 6, interval: [fifthInterval, seventhInterval] },
      color: toneColor,
    },
  ] as const;
}

function make7Arpeggio_AGPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
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
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6432_RootPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_6432_1stInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6432_2ndInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: fifthInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6432_3rdInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5321_RootPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: fifthInterval }, color: toneColor },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_5321_1stInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5321_2ndInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5321_3rdInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6543_RootPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_6543_1stInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6543_2ndInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: fifthInterval }, color: toneColor },
  ] as const;
}

function make7Chord_6543_3rdInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5432_RootPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_5432_1stInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5432_2ndInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
  ] as const;
}

function make7Chord_5432_3rdInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Chord_4321_RootPosition(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
  ] as const;
}

function make7Chord_4321_1stInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: fifthInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
  ] as const;
}

function make7Chord_4321_2ndInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
  ] as const;
}

function make7Chord_4321_3rdInversion(
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
  rootColor: FretboardNoteColorName,
  toneColor: FretboardNoteColorName,
): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
  ] as const;
}

// Doing this is needed due to TS limitations
// `as const` does not work properly in computed property names, and without it, the pattern names
// become widened to string, which breaks type safety in other parts of the app
type ArpeggioPatternSuffix =
  | ' Arpeggio'
  | ' Arpeggio (G position)'
  | ' Arpeggio (G position) + 6-4-3-2 (root position)'
  | ' Arpeggio (G position) + 6-5-4-3 (root position)'
  | ' Arpeggio (G position) + 4-3-2-1 (3rd inversion)'
  | ' Arpeggio (E position)'
  | ' Arpeggio (E position) + Left 6-4-3-2 (root position)'
  | ' Arpeggio (E position) + Left 4-3-2-1 (3rd inversion)'
  | ' Arpeggio (E position) + 6-5-4-3 (root position)'
  | ' Arpeggio (E position) + 5-4-3-2 (2nd inversion)'
  | ' Arpeggio (E position) + 5-3-2-1 (2nd inversion)'
  | ' Arpeggio (E position) + Right 6-4-3-2 (1st inversion)'
  | ' Arpeggio (E position) + Right 4-3-2-1 (root position)'
  | ' Arpeggio (D position)'
  | ' Arpeggio (D position) + 6-4-3-2 (1st inversion)'
  | ' Arpeggio (D position) + 6-5-4-3 (1st inversion)'
  | ' Arpeggio (D position) + 5-4-3-2 (3rd inversion)'
  | ' Arpeggio (D position) + 5-3-2-1 (3rd inversion)'
  | ' Arpeggio (D position) + 4-3-2-1 (root position)'
  | ' Arpeggio (C position)'
  | ' Arpeggio (C position) + 6-4-3-2 (2nd inversion)'
  | ' Arpeggio (C position) + 6-5-4-3 (2nd inversion)'
  | ' Arpeggio (C position) + 5-4-3-2 (3rd inversion)'
  | ' Arpeggio (C position) + 5-3-2-1 (3rd inversion)'
  | ' Arpeggio (C position) + 4-3-2-1 (1st inversion)'
  | ' Arpeggio (A position)'
  | ' Arpeggio (A position) + 6-4-3-2 (3rd inversion)'
  | ' Arpeggio (A position) + 6-5-4-3 (3rd inversion)'
  | ' Arpeggio (A position) + 5-4-3-2 (root position)'
  | ' Arpeggio (A position) + 5-3-2-1 (root position)'
  | ' Arpeggio (A position) + 4-3-2-1 (2nd inversion)'
  | ' Arpeggio (A-G position)'
  | ' Arpeggio (A-G position) + Left 6-4-3-2 (3rd inversion)'
  | ' Arpeggio (A-G position) + Left 4-3-2-1 (2nd inversion)'
  | ' Arpeggio (A-G position) + 6-5-4-3 (3rd inversion)'
  | ' Arpeggio (A-G position) + 5-4-3-2 (1st inversion)'
  | ' Arpeggio (A-G position) + 5-3-2-1 (1st inversion)'
  | ' Arpeggio (A-G position) + Right 6-4-3-2 (root position)'
  | ' Arpeggio (A-G position) + Right 4-3-2-1 (3rd inversion)';

type ArpeggioPatternName<TGroupName extends string> =
  `${TGroupName}${ArpeggioPatternSuffix}`;

type ArpeggioGroup<TGroupName extends string> = Record<
  `Arpeggios - ${TGroupName}`,
  Record<ArpeggioPatternName<TGroupName>, readonly PatternRule[]>
>;

function make7ArpeggioGroup<const TGroupName extends string>(
  groupName: TGroupName,
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
): ArpeggioGroup<TGroupName> {
  return {
    [`Arpeggios - ${groupName}`]: {
      [`${groupName} Arpeggio`]: [
        { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
        {
          condition: {
            interval: [thirdInterval, fifthInterval, seventhInterval],
          },
          color: SCALE_TONE_COLOR,
        },
      ] as PatternRule[],
      [`${groupName} Arpeggio (G position)`]: [
        ...make7Arpeggio_GPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (G position) + 6-4-3-2 (root position)`]: [
        ...make7Arpeggio_GPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (G position) + 6-5-4-3 (root position)`]: [
        ...make7Arpeggio_GPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (G position) + 4-3-2-1 (3rd inversion)`]: [
        ...make7Arpeggio_GPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + Left 6-4-3-2 (root position)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + Left 4-3-2-1 (3rd inversion)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + 6-5-4-3 (root position)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + 5-4-3-2 (2nd inversion)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5432_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + 5-3-2-1 (2nd inversion)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5321_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + Right 6-4-3-2 (1st inversion)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (E position) + Right 4-3-2-1 (root position)`]: [
        ...make7Arpeggio_EPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (D position)`]: [
        ...make7Arpeggio_DPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (D position) + 6-4-3-2 (1st inversion)`]: [
        ...make7Arpeggio_DPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (D position) + 6-5-4-3 (1st inversion)`]: [
        ...make7Arpeggio_DPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (D position) + 5-4-3-2 (3rd inversion)`]: [
        ...make7Arpeggio_DPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5432_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (D position) + 5-3-2-1 (3rd inversion)`]: [
        ...make7Arpeggio_DPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5321_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (D position) + 4-3-2-1 (root position)`]: [
        ...make7Arpeggio_DPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C position)`]: [
        ...make7Arpeggio_CPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C position) + 6-4-3-2 (2nd inversion)`]: [
        ...make7Arpeggio_CPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C position) + 6-5-4-3 (2nd inversion)`]: [
        ...make7Arpeggio_CPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C position) + 5-4-3-2 (3rd inversion)`]: [
        ...make7Arpeggio_CPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5432_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C position) + 5-3-2-1 (3rd inversion)`]: [
        ...make7Arpeggio_CPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5321_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C position) + 4-3-2-1 (1st inversion)`]: [
        ...make7Arpeggio_CPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C-A position)`]: [
        ...make7Arpeggio_CAPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C-A position) + 6-5-4-3 (2nd inversion)`]: [
        ...make7Arpeggio_CAPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C-A position) + 5-4-3-2 (root position)`]: [
        ...make7Arpeggio_CAPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5432_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C-A position) + 5-3-2-1 (root position)`]: [
        ...make7Arpeggio_CAPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5321_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (C-A position) + 4-3-2-1 (2nd inversion)`]: [
        ...make7Arpeggio_CAPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A position)`]: [
        ...make7Arpeggio_APosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A position) + 6-4-3-2 (3rd inversion)`]: [
        ...make7Arpeggio_APosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A position) + 6-5-4-3 (3rd inversion)`]: [
        ...make7Arpeggio_APosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A position) + 5-4-3-2 (root position)`]: [
        ...make7Arpeggio_APosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5432_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A position) + 5-3-2-1 (root position)`]: [
        ...make7Arpeggio_APosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5321_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A position) + 4-3-2-1 (2nd inversion)`]: [
        ...make7Arpeggio_APosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position)`]: [
        ...make7Arpeggio_AGPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position) + Left 6-4-3-2 (3rd inversion)`]: [
        ...make7Arpeggio_AGPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6432_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position) + Left 4-3-2-1 (2nd inversion)`]: [
        ...make7Arpeggio_AGPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_4321_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position) + 6-5-4-3 (3rd inversion)`]: [
        ...make7Arpeggio_AGPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_6543_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position) + 5-4-3-2 (1st inversion)`]: [
        ...make7Arpeggio_AGPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5432_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position) + 5-3-2-1 (1st inversion)`]: [
        ...make7Arpeggio_AGPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          SCALE_ROOT_COLOR,
          SCALE_TONE_COLOR,
        ),
        ...make7Chord_5321_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          CHORD_ROOT_COLOR,
          CHORD_TONE_COLOR,
        ),
      ],
      [`${groupName} Arpeggio (A-G position) + Right 6-4-3-2 (root position)`]:
        [
          ...make7Arpeggio_AGPosition(
            thirdInterval,
            fifthInterval,
            seventhInterval,
            SCALE_ROOT_COLOR,
            SCALE_TONE_COLOR,
          ),
          ...make7Chord_6432_RootPosition(
            thirdInterval,
            fifthInterval,
            seventhInterval,
            CHORD_ROOT_COLOR,
            CHORD_TONE_COLOR,
          ),
        ],
      [`${groupName} Arpeggio (A-G position) + Right 4-3-2-1 (3rd inversion)`]:
        [
          ...make7Arpeggio_AGPosition(
            thirdInterval,
            fifthInterval,
            seventhInterval,
            SCALE_ROOT_COLOR,
            SCALE_TONE_COLOR,
          ),
          ...make7Chord_4321_3rdInversion(
            thirdInterval,
            fifthInterval,
            seventhInterval,
            CHORD_ROOT_COLOR,
            CHORD_TONE_COLOR,
          ),
        ],
    },
  } as const as ArpeggioGroup<TGroupName>;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
function make7ChordGroup<const TGroupName extends string>(
  groupName: TGroupName,
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
) {
  return {
    [`Chords - ${groupName}` as const]: {
      [`${groupName} Chord Drop 3 (Bass 6th) | 6-4-3-2` as const]: [
        ...make7Chord_6432_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '1-STRONG',
          '1-LIGHT',
        ),
        ...make7Chord_6432_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '2-STRONG',
          '2-LIGHT',
        ),
        ...make7Chord_6432_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '3-STRONG',
          '3-LIGHT',
        ),
        ...make7Chord_6432_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '4-STRONG',
          '4-LIGHT',
        ),
      ],
      [`${groupName} Chord Drop 3 (Bass 5th) | 5-3-2-1` as const]: [
        ...make7Chord_5321_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '1-STRONG',
          '1-LIGHT',
        ),
        ...make7Chord_5321_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '2-STRONG',
          '2-LIGHT',
        ),
        ...make7Chord_5321_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '3-STRONG',
          '3-LIGHT',
        ),
        ...make7Chord_5321_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '4-STRONG',
          '4-LIGHT',
        ),
      ],
      [`${groupName} Chord Drop 2 (Bass 6th) | 6-5-4-3` as const]: [
        ...make7Chord_6543_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '1-STRONG',
          '1-LIGHT',
        ),
        ...make7Chord_6543_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '2-STRONG',
          '2-LIGHT',
        ),
        ...make7Chord_6543_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '3-STRONG',
          '3-LIGHT',
        ),
        ...make7Chord_6543_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '4-STRONG',
          '4-LIGHT',
        ),
      ],
      [`${groupName} Chord Drop 2 (Bass 5th) | 5-4-3-2` as const]: [
        ...make7Chord_5432_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '1-STRONG',
          '1-LIGHT',
        ),
        ...make7Chord_5432_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '2-STRONG',
          '2-LIGHT',
        ),
        ...make7Chord_5432_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '3-STRONG',
          '3-LIGHT',
        ),
        ...make7Chord_5432_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '4-STRONG',
          '4-LIGHT',
        ),
      ],
      [`${groupName} Chord Drop 2 (Bass 4th) | 4-3-2-1` as const]: [
        ...make7Chord_4321_RootPosition(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '1-STRONG',
          '1-LIGHT',
        ),
        ...make7Chord_4321_1stInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '2-STRONG',
          '2-LIGHT',
        ),
        ...make7Chord_4321_2ndInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '3-STRONG',
          '3-LIGHT',
        ),
        ...make7Chord_4321_3rdInversion(
          thirdInterval,
          fifthInterval,
          seventhInterval,
          '4-STRONG',
          '4-LIGHT',
        ),
      ],
    },
  } as const;
}

export const PATTERNS_GROUPED = {
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
  ...make7ArpeggioGroup('Maj7', '3', '5', '7'),
  ...make7ArpeggioGroup('7', '3', '5', 'b7'),
  ...make7ArpeggioGroup('min7', 'b3', '5', 'b7'),
  ...make7ArpeggioGroup('min7b5', 'b3', 'b5', 'b7'),
  ...make7ArpeggioGroup('dim7', 'b3', 'b5', 'bb7'),
  ...make7ArpeggioGroup('minMaj7', 'b3', '5', '7'),
  ...make7ChordGroup('Maj7', '3', '5', '7'),
  ...make7ChordGroup('7', '3', '5', 'b7'),
  ...make7ChordGroup('min7', 'b3', '5', 'b7'),
  ...make7ChordGroup('min7b5', 'b3', 'b5', 'b7'),
  ...make7ChordGroup('dim7', 'b3', 'b5', 'bb7'),
  ...make7ChordGroup('minMaj7', 'b3', '5', '7'),
} as const satisfies Record<string, Record<string, Pattern>>;

export type PatternGroupName = keyof typeof PATTERNS_GROUPED;

export type PatternName = KeysOfUnion<
  (typeof PATTERNS_GROUPED)[PatternGroupName]
>;

// Flatten for easy lookup
export const PATTERNS = objectValues(PATTERNS_GROUPED).reduce<
  Record<PatternName, Pattern>
>((acc, group) => ({ ...acc, ...group }), {} as Record<PatternName, Pattern>);
