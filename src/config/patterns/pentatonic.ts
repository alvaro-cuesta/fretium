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

function makePentatonic(
  displayName: string,
  secondInterval: SecondInterval | false,
  thirdInterval: ThirdInterval | false,
  fourthInterval: FourthInterval | false,
  fifthInterval: FifthInterval | false,
  sixthInterval: SixthInterval | false,
  seventhInterval: SeventhInterval | false,
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
      'caged-positions': {
        type: 'optgroup',
        displayName: 'CAGED positions',
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

export const PATTERNS_PENTATONIC = {
  type: 'sublist',
  displayName: 'Pentatonic',
  entries: {
    major: makePentatonic('Major', '2', '3', false, '5', '6', false),
    suspended: makePentatonic('Suspended', '2', false, '4', '5', false, 'b7'),
    'blues-minor': makePentatonic(
      'Blues minor',
      false,
      'b3',
      '4',
      false,
      'b6',
      'b7',
    ),
    'blues-major': makePentatonic(
      'Blues major',
      '2',
      false,
      '4',
      '5',
      '6',
      false,
    ),
    minor: makePentatonic('Minor', false, 'b3', '4', '5', false, 'b7'),
  },
} as const satisfies PatternConfigEntryList;
