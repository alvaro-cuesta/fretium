import type { FretboardNoteColorName } from '../../components/Fretboard/theme';
import type {
  PatternConfigEntryList,
  PatternConfigEntryListSublist,
} from '../../lib/pattern-config';
import type { PatternRule } from '../../lib/pattern-engine';
import {
  ALT_OPACITY,
  CHORD_ROOT_COLOR,
  CHORD_TONE_COLOR,
  SCALE_ROOT_COLOR,
  SCALE_TONE_COLOR,
  type FifthInterval,
  type SeventhInterval,
  type ThirdInterval,
} from './common';
import {
  make7Tetrad_4321_1stInversion,
  make7Tetrad_4321_2ndInversion,
  make7Tetrad_4321_3rdInversion,
  make7Tetrad_4321_RootPosition,
  make7Tetrad_5321_1stInversion,
  make7Tetrad_5321_2ndInversion,
  make7Tetrad_5321_3rdInversion,
  make7Tetrad_5321_RootPosition,
  make7Tetrad_5432_1stInversion,
  make7Tetrad_5432_2ndInversion,
  make7Tetrad_5432_3rdInversion,
  make7Tetrad_5432_RootPosition,
  make7Tetrad_6432_1stInversion,
  make7Tetrad_6432_2ndInversion,
  make7Tetrad_6432_3rdInversion,
  make7Tetrad_6432_RootPosition,
  make7Tetrad_6543_1stInversion,
  make7Tetrad_6543_2ndInversion,
  make7Tetrad_6543_3rdInversion,
  make7Tetrad_6543_RootPosition,
} from './common-builders/tetrads';

export const PATTERNS_ARPEGGIOS = {
  type: 'optgroup',
  displayName: 'Arpeggios',
  entries: {
    maj7: make7ArpeggioGroup('Maj7', '3', '5', '7'),
    dom7: make7ArpeggioGroup('7', '3', '5', 'b7'),
    min7: make7ArpeggioGroup('min7', 'b3', '5', 'b7'),
    min7b5: make7ArpeggioGroup('min7b5', 'b3', 'b5', 'b7'),
    dim7: make7ArpeggioGroup('dim7', 'b3', 'b5', 'bb7'),
    minMaj7: make7ArpeggioGroup('minMaj7', 'b3', '5', '7'),
  },
} satisfies PatternConfigEntryList;

function make7ArpeggioGroup(
  displayName: string,
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
): PatternConfigEntryListSublist {
  return {
    type: 'sublist',
    displayName: `${displayName} Arpeggio`,
    entries: {
      full: {
        displayName: 'Full',
        rules: [
          { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
          {
            condition: {
              interval: [thirdInterval, fifthInterval, seventhInterval],
            },
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
            type: 'sublist',
            displayName: 'E position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_EPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              '6432-root': {
                displayName: '+ 6-4-3-2 (root)',
                rules: [
                  ...make7Arpeggio_EPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '6543-root': {
                displayName: '+ 6-5-4-3 (root)',
                rules: [
                  ...make7Arpeggio_EPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '4321-3rd': {
                displayName: '+ 4-3-2-1 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_EPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
          ed: {
            type: 'sublist',
            displayName: 'E-D position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              'left-6432-root': {
                displayName: '+ Left 6-4-3-2 (root)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              'left-4321-3rd': {
                displayName: '+ Left 4-3-2-1 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '6543-root': {
                displayName: '+ 6-5-4-3 (root)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5432-2nd': {
                displayName: '+ 5-4-3-2 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5432_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5321-2nd': {
                displayName: '+ 5-3-2-1 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5321_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              'right-6432-1st': {
                displayName: '+ Right 6-4-3-2 (1st inversion)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_1stInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              'right-4321-root': {
                displayName: '+ Right 4-3-2-1 (root)',
                rules: [
                  ...make7Arpeggio_EDPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
          d: {
            type: 'sublist',
            displayName: 'D position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_DPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              '6432-1st': {
                displayName: '+ 6-4-3-2 (1st inversion)',
                rules: [
                  ...make7Arpeggio_DPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_1stInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '6543-1st': {
                displayName: '+ 6-5-4-3 (1st inversion)',
                rules: [
                  ...make7Arpeggio_DPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_1stInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5432-3rd': {
                displayName: '+ 5-4-3-2 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_DPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5432_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5321-3rd': {
                displayName: '+ 5-3-2-1 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_DPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5321_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '4321-root': {
                displayName: '+ 4-3-2-1 (root)',
                rules: [
                  ...make7Arpeggio_DPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
          c: {
            type: 'sublist',
            displayName: 'C position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_CPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              '6432-2nd': {
                displayName: '+ 6-4-3-2 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_CPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '6543-2nd': {
                displayName: '+ 6-5-4-3 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_CPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5432-3rd': {
                displayName: '+ 5-4-3-2 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_CPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5432_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5321-3rd': {
                displayName: '+ 5-3-2-1 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_CPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5321_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '4321-1st': {
                displayName: '+ 4-3-2-1 (1st inversion)',
                rules: [
                  ...make7Arpeggio_CPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_1stInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
          a: {
            type: 'sublist',
            displayName: 'A position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_APosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              '6543-2nd': {
                displayName: '+ 6-5-4-3 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_APosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5432-root': {
                displayName: '+ 5-4-3-2 (root)',
                rules: [
                  ...make7Arpeggio_APosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5432_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5321-root': {
                displayName: '+ 5-3-2-1 (root)',
                rules: [
                  ...make7Arpeggio_APosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5321_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '4321-2nd': {
                displayName: '+ 4-3-2-1 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_APosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
          ag: {
            type: 'sublist',
            displayName: 'A-G position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_AGPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              '6432-3rd': {
                displayName: '+ 6-4-3-2 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_AGPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '6543-3rd': {
                displayName: '+ 6-5-4-3 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_AGPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5432-root': {
                displayName: '+ 5-4-3-2 (root)',
                rules: [
                  ...make7Arpeggio_AGPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5432_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5321-root': {
                displayName: '+ 5-3-2-1 (root)',
                rules: [
                  ...make7Arpeggio_AGPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5321_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '4321-2nd': {
                displayName: '+ 4-3-2-1 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_AGPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
          g: {
            type: 'sublist',
            displayName: 'G position',
            entries: {
              base: {
                displayName: 'No chord tones',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                ],
              },
              'left-6432-3rd': {
                displayName: '+ Left 6-4-3-2 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              'left-4321-2nd': {
                displayName: '+ Left 4-3-2-1 (2nd inversion)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_2ndInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '6543-3rd': {
                displayName: '+ 6-5-4-3 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6543_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5432-1st': {
                displayName: '+ 5-4-3-2 (1st inversion)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5432_1stInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              '5321-1st': {
                displayName: '+ 5-3-2-1 (1st inversion)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_5321_1stInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              'right-6432-root': {
                displayName: '+ Right 6-4-3-2 (root)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_6432_RootPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
              'right-4321-3rd': {
                displayName: '+ Right 4-3-2-1 (3rd inversion)',
                rules: [
                  ...make7Arpeggio_GPosition(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    SCALE_ROOT_COLOR,
                    SCALE_TONE_COLOR,
                  ),
                  ...make7Tetrad_4321_3rdInversion(
                    thirdInterval,
                    fifthInterval,
                    seventhInterval,
                    CHORD_ROOT_COLOR,
                    CHORD_TONE_COLOR,
                  ),
                ],
              },
            },
          },
        },
      },
    },
  };
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
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}

function make7Arpeggio_EDPosition(
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
    {
      condition: { string: 3, interval: thirdInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 4, interval: thirdInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    {
      condition: { string: 4, interval: seventhInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    {
      condition: { string: 5, interval: seventhInterval },
      color: toneColor,
      opacity: ALT_OPACITY,
    },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
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
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    {
      condition: { string: 6, interval: [thirdInterval, fifthInterval] },
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
