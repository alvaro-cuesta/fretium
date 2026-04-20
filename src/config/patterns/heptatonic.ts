import type { PatternConfigEntryList } from '../../lib/pattern-config';
import {
  SCALE_ROOT_COLOR,
  SCALE_TONE_COLOR,
  type FifthInterval,
  type FourthInterval,
  type SecondInterval,
  type SeventhInterval,
  type SixthInterval,
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

function makeHeptatonic(
  displayName: string,
  secondInterval: SecondInterval,
  thirdInterval: ThirdInterval,
  fourthInterval: FourthInterval,
  fifthInterval: FifthInterval,
  sixthInterval: SixthInterval,
  seventhInterval: SeventhInterval,
) {
  const cagedOptions = {
    secondInterval,
    thirdInterval,
    fourthInterval,
    fifthInterval,
    sixthInterval,
    seventhInterval,
    rootColor: SCALE_ROOT_COLOR,
    toneColor: SCALE_TONE_COLOR,
  } as const;

  return {
    type: 'sublist',
    displayName,
    entries: {
      full: {
        type: 'pattern',
        displayName: 'Full',
        rules: [
          { condition: { interval: '1' }, color: SCALE_ROOT_COLOR },
          {
            condition: {
              interval: [
                secondInterval,
                thirdInterval,
                fourthInterval,
                fifthInterval,
                sixthInterval,
                seventhInterval,
              ],
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
  } as const satisfies PatternConfigEntryList;
}

export const PATTERNS_HEPTATONIC = {
  heptatonic: {
    type: 'optgroup',
    displayName: 'Heptatonic',
    entries: {
      major: makeHeptatonic('Major', '2', '3', '4', '5', '6', '7'),
      minor: makeHeptatonic('Natural minor', '2', 'b3', '4', '5', 'b6', 'b7'),
      'harmonic-minor': makeHeptatonic(
        'Harmonic minor',
        '2',
        'b3',
        '4',
        '5',
        'b6',
        '7',
      ),
    },
  },
  modes: {
    type: 'optgroup',
    displayName: 'Heptatonic - Major modes',
    entries: {
      lydian: makeHeptatonic('Lydian', '2', '3', '#4', '5', '6', '7'),
      ionian: makeHeptatonic('Ionian', '2', '3', '4', '5', '6', '7'),
      mixolydian: makeHeptatonic('Mixolydian', '2', '3', '4', '5', '6', 'b7'),
      dorian: makeHeptatonic('Dorian', '2', 'b3', '4', '5', '6', 'b7'),
      aeolian: makeHeptatonic('Aeolian', '2', 'b3', '4', '5', 'b6', 'b7'),
      phrygian: makeHeptatonic('Phrygian', 'b2', 'b3', '4', '5', 'b6', 'b7'),
      locrian: makeHeptatonic('Locrian', 'b2', 'b3', '4', 'b5', 'b6', 'b7'),
    },
  },
} as const satisfies Record<string, PatternConfigEntryList>;
