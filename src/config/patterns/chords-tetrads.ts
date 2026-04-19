import type {
  PatternConfigEntryList,
  PatternConfigEntryListSublist,
} from '../../lib/pattern-config';
import type { FifthInterval, SeventhInterval, ThirdInterval } from './common';
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
  type Make7TetradPositionFn,
} from './common-builders/tetrads';

export const PATTERNS_CHORDS_TETRADS = {
  type: 'optgroup',
  displayName: 'Chords - Tetrads',
  entries: {
    maj7: make7TetradGroup('Maj7', '3', '5', '7'),
    dom7: make7TetradGroup('7', '3', '5', 'b7'),
    min7: make7TetradGroup('min7', 'b3', '5', 'b7'),
    min7b5: make7TetradGroup('min7b5', 'b3', 'b5', 'b7'),
    dim7: make7TetradGroup('dim7', 'b3', 'b5', 'bb7'),
    minMaj7: make7TetradGroup('minMaj7', 'b3', '5', '7'),
  },
} satisfies PatternConfigEntryList;

function make7TetradGroup(
  displayName: string,
  thirdInterval: ThirdInterval,
  fifthInterval: FifthInterval,
  seventhInterval: SeventhInterval,
): PatternConfigEntryListSublist {
  const intervals = { thirdInterval, fifthInterval, seventhInterval } as const;

  return {
    type: 'sublist',
    displayName: `${displayName} Tetrad`,
    entries: {
      drop3: {
        type: 'optgroup',
        displayName: 'Drop 3',
        entries: {
          _6432: make7TetradSubgroup(
            'Drop 3 (Bass 6th) | 6-4-3-2',
            intervals,
            make7Tetrad_6432_RootPosition,
            make7Tetrad_6432_1stInversion,
            make7Tetrad_6432_2ndInversion,
            make7Tetrad_6432_3rdInversion,
          ),
          _5321: make7TetradSubgroup(
            'Drop 3 (Bass 5th) | 5-3-2-1',
            intervals,
            make7Tetrad_5321_RootPosition,
            make7Tetrad_5321_1stInversion,
            make7Tetrad_5321_2ndInversion,
            make7Tetrad_5321_3rdInversion,
          ),
        },
      },
      drop2: {
        type: 'optgroup',
        displayName: 'Drop 2',
        entries: {
          _6543: make7TetradSubgroup(
            'Drop 2 (Bass 6th) | 6-5-4-3',
            intervals,
            make7Tetrad_6543_RootPosition,
            make7Tetrad_6543_1stInversion,
            make7Tetrad_6543_2ndInversion,
            make7Tetrad_6543_3rdInversion,
          ),
          _5432: make7TetradSubgroup(
            'Drop 2 (Bass 5th) | 5-4-3-2',
            intervals,
            make7Tetrad_5432_RootPosition,
            make7Tetrad_5432_1stInversion,
            make7Tetrad_5432_2ndInversion,
            make7Tetrad_5432_3rdInversion,
          ),
          _4321: make7TetradSubgroup(
            'Drop 2 (Bass 4th) | 4-3-2-1',
            intervals,
            make7Tetrad_4321_RootPosition,
            make7Tetrad_4321_1stInversion,
            make7Tetrad_4321_2ndInversion,
            make7Tetrad_4321_3rdInversion,
          ),
        },
      },
    },
  };
}

type Make7TetradIntervals = {
  thirdInterval: ThirdInterval;
  fifthInterval: FifthInterval;
  seventhInterval: SeventhInterval;
};

function make7TetradSubgroup(
  displayName: string,
  intervals: Make7TetradIntervals,
  makeRootPosition: Make7TetradPositionFn,
  make1stInversion: Make7TetradPositionFn,
  make2ndInversion: Make7TetradPositionFn,
  make3rdInversion: Make7TetradPositionFn,
): PatternConfigEntryListSublist {
  const colors = [
    {
      rootColor: '1-STRONG',
      toneColor: '1-LIGHT',
    },
    {
      rootColor: '2-STRONG',
      toneColor: '2-LIGHT',
    },
    {
      rootColor: '3-STRONG',
      toneColor: '3-LIGHT',
    },
    {
      rootColor: '4-STRONG',
      toneColor: '4-LIGHT',
    },
  ] as const;

  return {
    type: 'sublist',
    displayName,
    entries: {
      all: {
        type: 'pattern',
        displayName: 'All inversions',
        rules: [
          ...makeRootPosition({ ...intervals, ...colors[0] }),
          ...make1stInversion({ ...intervals, ...colors[1] }),
          ...make2ndInversion({ ...intervals, ...colors[2] }),
          ...make3rdInversion({ ...intervals, ...colors[3] }),
        ],
        isFullOctave: true,
      },
      root: {
        type: 'pattern',
        displayName: 'Root',
        rules: makeRootPosition({ ...intervals, ...colors[0] }),
      },
      '1st': {
        type: 'pattern',
        displayName: '1st inversion',
        rules: make1stInversion({ ...intervals, ...colors[0] }),
      },
      '2nd': {
        type: 'pattern',
        displayName: '2nd inversion',
        rules: make2ndInversion({ ...intervals, ...colors[0] }),
      },
      '3rd': {
        type: 'pattern',
        displayName: '3rd inversion',
        rules: make3rdInversion({ ...intervals, ...colors[0] }),
      },
    },
  };
}
