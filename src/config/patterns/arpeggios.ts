import type {
  PatternConfigEntryList,
  PatternConfigEntryListSublist,
} from '../../lib/pattern-config';
import {
  CHORD_ROOT_COLOR,
  CHORD_TONE_COLOR,
  SCALE_ROOT_COLOR,
  SCALE_TONE_COLOR,
  type FifthInterval,
  type SeventhInterval,
  type ThirdInterval,
} from './common';
import {
  makeCaged_AGPosition,
  makeCaged_APosition,
  makeCaged_CPosition,
  makeCaged_DPosition,
  makeCaged_EDPosition,
  makeCaged_EPosition,
  makeCaged_GPosition,
} from './common-builders/caged';
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
  const intervals = {
    secondInterval: false,
    thirdInterval,
    fourthInterval: false,
    fifthInterval,
    sixthInterval: false,
    seventhInterval,
  } as const;

  const cagedOptions = {
    ...intervals,
    rootColor: SCALE_ROOT_COLOR,
    toneColor: SCALE_TONE_COLOR,
  } as const;

  const caged_EPosition = makeCaged_EPosition(cagedOptions);
  const caged_EDPosition = makeCaged_EDPosition(cagedOptions);
  const caged_DPosition = makeCaged_DPosition(cagedOptions);
  const caged_CPosition = makeCaged_CPosition(cagedOptions);
  const caged_APosition = makeCaged_APosition(cagedOptions);
  const caged_AGPosition = makeCaged_AGPosition(cagedOptions);
  const caged_GPosition = makeCaged_GPosition(cagedOptions);

  const tetradOptions = {
    ...intervals,
    rootColor: CHORD_ROOT_COLOR,
    toneColor: CHORD_TONE_COLOR,
  } as const;

  const tetrad_6543_RootPosition = make7Tetrad_6543_RootPosition(tetradOptions);
  const tetrad_6543_1stInversion = make7Tetrad_6543_1stInversion(tetradOptions);
  const tetrad_6543_2ndInversion = make7Tetrad_6543_2ndInversion(tetradOptions);
  const tetrad_6543_3rdInversion = make7Tetrad_6543_3rdInversion(tetradOptions);

  const tetrad_6432_RootPosition = make7Tetrad_6432_RootPosition(tetradOptions);
  const tetrad_6432_1stInversion = make7Tetrad_6432_1stInversion(tetradOptions);
  const tetrad_6432_2ndInversion = make7Tetrad_6432_2ndInversion(tetradOptions);
  const tetrad_6432_3rdInversion = make7Tetrad_6432_3rdInversion(tetradOptions);

  const tetrad_5432_RootPosition = make7Tetrad_5432_RootPosition(tetradOptions);
  const tetrad_5432_1stInversion = make7Tetrad_5432_1stInversion(tetradOptions);
  const tetrad_5432_2ndInversion = make7Tetrad_5432_2ndInversion(tetradOptions);
  const tetrad_5432_3rdInversion = make7Tetrad_5432_3rdInversion(tetradOptions);

  const tetrad_5321_RootPosition = make7Tetrad_5321_RootPosition(tetradOptions);
  const tetrad_5321_1stInversion = make7Tetrad_5321_1stInversion(tetradOptions);
  const tetrad_5321_2ndInversion = make7Tetrad_5321_2ndInversion(tetradOptions);
  const tetrad_5321_3rdInversion = make7Tetrad_5321_3rdInversion(tetradOptions);

  const tetrad_4321_RootPosition = make7Tetrad_4321_RootPosition(tetradOptions);
  const tetrad_4321_1stInversion = make7Tetrad_4321_1stInversion(tetradOptions);
  const tetrad_4321_2ndInversion = make7Tetrad_4321_2ndInversion(tetradOptions);
  const tetrad_4321_3rdInversion = make7Tetrad_4321_3rdInversion(tetradOptions);

  return {
    type: 'sublist',
    displayName: `${displayName} Arpeggio`,
    entries: {
      full: {
        type: 'pattern',
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
                type: 'pattern',
                displayName: 'No chord tones',
                rules: caged_EPosition,
              },
              '6432-root': {
                type: 'pattern',
                displayName: '+ 6-4-3-2 (root)',
                rules: [...caged_EPosition, ...tetrad_6432_RootPosition],
              },
              '6543-root': {
                type: 'pattern',
                displayName: '+ 6-5-4-3 (root)',
                rules: [...caged_EPosition, ...tetrad_6543_RootPosition],
              },
              '4321-3rd': {
                type: 'pattern',
                displayName: '+ 4-3-2-1 (3rd inversion)',
                rules: [...caged_EPosition, ...tetrad_4321_3rdInversion],
              },
            },
          },
          ed: {
            type: 'sublist',
            displayName: 'E-D position',
            entries: {
              base: {
                type: 'pattern',
                displayName: 'No chord tones',
                rules: caged_EDPosition,
              },
              'left-6432-root': {
                type: 'pattern',
                displayName: '+ Left 6-4-3-2 (root)',
                rules: [...caged_EDPosition, ...tetrad_6432_RootPosition],
              },
              'left-4321-3rd': {
                type: 'pattern',
                displayName: '+ Left 4-3-2-1 (3rd inversion)',
                rules: [...caged_EDPosition, ...tetrad_4321_3rdInversion],
              },
              '6543-root': {
                type: 'pattern',
                displayName: '+ 6-5-4-3 (root)',
                rules: [...caged_EDPosition, ...tetrad_6543_RootPosition],
              },
              '5432-2nd': {
                type: 'pattern',
                displayName: '+ 5-4-3-2 (2nd inversion)',
                rules: [...caged_EDPosition, ...tetrad_5432_2ndInversion],
              },
              '5321-2nd': {
                type: 'pattern',
                displayName: '+ 5-3-2-1 (2nd inversion)',
                rules: [...caged_EDPosition, ...tetrad_5321_2ndInversion],
              },
              'right-6432-1st': {
                type: 'pattern',
                displayName: '+ Right 6-4-3-2 (1st inversion)',
                rules: [...caged_EDPosition, ...tetrad_6432_1stInversion],
              },
              'right-4321-root': {
                type: 'pattern',
                displayName: '+ Right 4-3-2-1 (root)',
                rules: [
                  ...caged_EDPosition,
                  ...make7Tetrad_4321_RootPosition(tetradOptions),
                ],
              },
            },
          },
          d: {
            type: 'sublist',
            displayName: 'D position',
            entries: {
              base: {
                type: 'pattern',
                displayName: 'No chord tones',
                rules: caged_DPosition,
              },
              '6432-1st': {
                type: 'pattern',
                displayName: '+ 6-4-3-2 (1st inversion)',
                rules: [...caged_DPosition, ...tetrad_6432_1stInversion],
              },
              '6543-1st': {
                type: 'pattern',
                displayName: '+ 6-5-4-3 (1st inversion)',
                rules: [...caged_DPosition, ...tetrad_6543_1stInversion],
              },
              '5432-3rd': {
                type: 'pattern',
                displayName: '+ 5-4-3-2 (3rd inversion)',
                rules: [...caged_DPosition, ...tetrad_5432_3rdInversion],
              },
              '5321-3rd': {
                type: 'pattern',
                displayName: '+ 5-3-2-1 (3rd inversion)',
                rules: [...caged_DPosition, ...tetrad_5321_3rdInversion],
              },
              '4321-root': {
                type: 'pattern',
                displayName: '+ 4-3-2-1 (root)',
                rules: [...caged_DPosition, ...tetrad_4321_RootPosition],
              },
            },
          },
          c: {
            type: 'sublist',
            displayName: 'C position',
            entries: {
              base: {
                type: 'pattern',
                displayName: 'No chord tones',
                rules: caged_CPosition,
              },
              '6432-2nd': {
                type: 'pattern',
                displayName: '+ 6-4-3-2 (2nd inversion)',
                rules: [...caged_CPosition, ...tetrad_6432_2ndInversion],
              },
              '6543-2nd': {
                type: 'pattern',
                displayName: '+ 6-5-4-3 (2nd inversion)',
                rules: [...caged_CPosition, ...tetrad_6543_2ndInversion],
              },
              '5432-3rd': {
                type: 'pattern',
                displayName: '+ 5-4-3-2 (3rd inversion)',
                rules: [...caged_CPosition, ...tetrad_5432_3rdInversion],
              },
              '5321-3rd': {
                type: 'pattern',
                displayName: '+ 5-3-2-1 (3rd inversion)',
                rules: [...caged_CPosition, ...tetrad_5321_3rdInversion],
              },
              '4321-1st': {
                type: 'pattern',
                displayName: '+ 4-3-2-1 (1st inversion)',
                rules: [...caged_CPosition, ...tetrad_4321_1stInversion],
              },
            },
          },
          a: {
            type: 'sublist',
            displayName: 'A position',
            entries: {
              base: {
                type: 'pattern',
                displayName: 'No chord tones',
                rules: caged_APosition,
              },
              '6543-2nd': {
                displayName: '+ 6-5-4-3 (2nd inversion)',
                type: 'pattern',
                rules: [...caged_APosition, ...tetrad_6543_2ndInversion],
              },
              '5432-root': {
                type: 'pattern',
                displayName: '+ 5-4-3-2 (root)',
                rules: [...caged_APosition, ...tetrad_5432_RootPosition],
              },
              '5321-root': {
                type: 'pattern',
                displayName: '+ 5-3-2-1 (root)',
                rules: [...caged_APosition, ...tetrad_5321_RootPosition],
              },
              '4321-2nd': {
                type: 'pattern',
                displayName: '+ 4-3-2-1 (2nd inversion)',
                rules: [...caged_APosition, ...tetrad_4321_2ndInversion],
              },
            },
          },
          ag: {
            type: 'sublist',
            displayName: 'A-G position',
            entries: {
              base: {
                type: 'pattern',
                displayName: 'No chord tones',
                rules: caged_AGPosition,
              },
              '6432-3rd': {
                displayName: '+ 6-4-3-2 (3rd inversion)',
                type: 'pattern',
                rules: [...caged_AGPosition, ...tetrad_6432_3rdInversion],
              },
              '6543-3rd': {
                type: 'pattern',
                displayName: '+ 6-5-4-3 (3rd inversion)',
                rules: [...caged_AGPosition, ...tetrad_6543_3rdInversion],
              },
              '5432-root': {
                displayName: '+ 5-4-3-2 (root)',
                type: 'pattern',
                rules: [...caged_AGPosition, ...tetrad_5432_RootPosition],
              },
              '5321-root': {
                displayName: '+ 5-3-2-1 (root)',
                type: 'pattern',
                rules: [...caged_AGPosition, ...tetrad_5321_RootPosition],
              },
              '4321-2nd': {
                displayName: '+ 4-3-2-1 (2nd inversion)',
                type: 'pattern',
                rules: [...caged_AGPosition, ...tetrad_4321_2ndInversion],
              },
            },
          },
          g: {
            type: 'sublist',
            displayName: 'G position',
            entries: {
              base: {
                displayName: 'No chord tones',
                type: 'pattern',
                rules: caged_GPosition,
              },
              'left-6432-3rd': {
                displayName: '+ Left 6-4-3-2 (3rd inversion)',
                type: 'pattern',
                rules: [...caged_GPosition, ...tetrad_6432_3rdInversion],
              },
              'left-4321-2nd': {
                displayName: '+ Left 4-3-2-1 (2nd inversion)',
                type: 'pattern',
                rules: [...caged_GPosition, ...tetrad_4321_2ndInversion],
              },
              '6543-3rd': {
                displayName: '+ 6-5-4-3 (3rd inversion)',
                type: 'pattern',
                rules: [...caged_GPosition, ...tetrad_6543_3rdInversion],
              },
              '5432-1st': {
                type: 'pattern',
                displayName: '+ 5-4-3-2 (1st inversion)',
                rules: [...caged_GPosition, ...tetrad_5432_1stInversion],
              },
              '5321-1st': {
                type: 'pattern',
                displayName: '+ 5-3-2-1 (1st inversion)',
                rules: [...caged_GPosition, ...tetrad_5321_1stInversion],
              },
              'right-6432-root': {
                type: 'pattern',
                displayName: '+ Right 6-4-3-2 (root)',
                rules: [...caged_GPosition, ...tetrad_6432_RootPosition],
              },
              'right-4321-3rd': {
                type: 'pattern',
                displayName: '+ Right 4-3-2-1 (3rd inversion)',
                rules: [...caged_GPosition, ...tetrad_4321_3rdInversion],
              },
            },
          },
        },
      },
    },
  };
}
