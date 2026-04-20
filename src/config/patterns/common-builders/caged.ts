import type { FretboardNoteColorName } from '../../../components/Fretboard/theme';
import type { PatternRuleNode } from '../../../lib/pattern-engine';
import {
  ALT_OPACITY,
  type FifthInterval,
  type FourthInterval,
  type SecondInterval,
  type SeventhInterval,
  type SixthInterval,
  type ThirdInterval,
} from '../common';

type MakeCagedPositionOptions = {
  secondInterval: SecondInterval | false;
  thirdInterval: ThirdInterval | false;
  fourthInterval: FourthInterval | false;
  fifthInterval: FifthInterval | false;
  sixthInterval: SixthInterval | false;
  seventhInterval: SeventhInterval | false;
  rootColor: FretboardNoteColorName;
  toneColor: FretboardNoteColorName;
};

export type MakeCagedPositionFn = (
  options: MakeCagedPositionOptions,
) => PatternRuleNode[];

export function makeCaged_EPosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: { string: 1 },
      children: [
        { condition: { interval: seventhInterval }, color: toneColor },
        { condition: { interval: '1' }, color: rootColor },
        { condition: { interval: secondInterval }, color: toneColor },
      ],
    },
    {
      condition: { string: 2, interval: [fifthInterval, sixthInterval] },
      color: toneColor,
    },
    {
      condition: {
        string: 3,
        interval: [secondInterval, thirdInterval, fourthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 4 },
      children: [
        { condition: { interval: sixthInterval }, color: toneColor },
        { condition: { interval: seventhInterval }, color: toneColor },
        { condition: { interval: '1' }, color: rootColor },
      ],
    },
    {
      condition: {
        string: 5,
        interval: [thirdInterval, fourthInterval, fifthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 6 },
      children: [
        { condition: { interval: seventhInterval }, color: toneColor },
        { condition: { interval: '1' }, color: rootColor },
        {
          condition: { interval: secondInterval },
          color: toneColor,
        },
      ],
    },
  ];
}
makeCaged_EPosition satisfies MakeCagedPositionFn;

export function makeCaged_EDPosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: { string: 1 },
      children: [
        { condition: { interval: '1' }, color: rootColor },
        {
          condition: { interval: [secondInterval, thirdInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: { string: 2 },
      children: [
        {
          condition: { interval: fifthInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        {
          condition: { interval: [sixthInterval, seventhInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: { string: 3 },
      children: [
        {
          condition: { interval: [thirdInterval, fourthInterval] },
          color: toneColor,
        },
        {
          condition: { interval: fifthInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: { string: 4 },
      children: [
        { condition: { interval: seventhInterval }, color: toneColor },
        { condition: { interval: '1' }, color: rootColor },
        { condition: { interval: secondInterval }, color: toneColor },
      ],
    },
    {
      condition: {
        string: 5,
        interval: [fourthInterval, fifthInterval, sixthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 6 },
      children: [
        { condition: { interval: '1' }, color: rootColor },
        {
          condition: { interval: [secondInterval, thirdInterval] },
          color: toneColor,
        },
      ],
    },
  ];
}
makeCaged_EDPosition satisfies MakeCagedPositionFn;

export function makeCaged_DPosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: {
        string: 1,
        interval: [secondInterval, thirdInterval, fourthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 2 },
      children: [
        {
          condition: { interval: [sixthInterval, seventhInterval] },
          color: toneColor,
        },
        { condition: { interval: '1' }, color: rootColor },
      ],
    },
    {
      condition: { string: 3 },
      children: [
        {
          condition: { interval: thirdInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        {
          condition: { interval: [fourthInterval, fifthInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: { string: 4 },
      children: [
        {
          condition: { interval: seventhInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        { condition: { interval: '1' }, color: rootColor },
        { condition: { interval: secondInterval }, color: toneColor },
        {
          condition: { interval: thirdInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: { string: 5 },
      children: [
        {
          condition: { interval: [fifthInterval, sixthInterval] },
          color: toneColor,
        },
        {
          condition: { interval: seventhInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: {
        string: 6,
        interval: [secondInterval, thirdInterval, fourthInterval],
      },
      color: toneColor,
    },
  ];
}
makeCaged_DPosition satisfies MakeCagedPositionFn;

export function makeCaged_CPosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: {
        string: 1,
        interval: [thirdInterval, fourthInterval, fifthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 2 },
      children: [
        {
          condition: { interval: seventhInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        { condition: { interval: '1' }, color: rootColor },
        { condition: { interval: '2' }, color: toneColor },
      ],
    },
    {
      condition: { string: 3 },
      children: [
        {
          condition: { interval: [fifthInterval, sixthInterval] },
          color: toneColor,
        },
        {
          condition: { interval: seventhInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: {
        string: 4,
        interval: [secondInterval, thirdInterval, fourthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 5 },
      children: [
        {
          condition: { interval: [sixthInterval, seventhInterval] },
          color: toneColor,
        },
        { condition: { interval: '1' }, color: rootColor },
      ],
    },
    {
      condition: {
        string: 6,
        interval: [thirdInterval, fourthInterval, fifthInterval],
      },
      color: toneColor,
    },
  ];
}
makeCaged_CPosition satisfies MakeCagedPositionFn;

export function makeCaged_APosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: {
        string: 1,
        interval: [fourthInterval, fifthInterval, sixthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 2 },
      children: [
        {
          condition: { interval: '1' },
          color: rootColor,
          opacity: ALT_OPACITY,
        },
        {
          condition: { string: 2, interval: [secondInterval, thirdInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: { string: 3 },
      children: [
        {
          condition: { interval: [sixthInterval, seventhInterval] },
          color: toneColor,
        },
        {
          condition: { interval: '1' },
          color: rootColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: {
        string: 4,
        interval: [thirdInterval, fourthInterval, fifthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 5 },
      children: [
        { condition: { interval: seventhInterval }, color: toneColor },
        { condition: { interval: '1' }, color: rootColor },
        { condition: { interval: secondInterval }, color: toneColor },
      ],
    },
    {
      condition: {
        string: 6,
        interval: [fourthInterval, fifthInterval, sixthInterval],
      },
      color: toneColor,
    },
  ];
}
makeCaged_APosition satisfies MakeCagedPositionFn;

export function makeCaged_AGPosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: {
        string: 1,
        interval: [fifthInterval, sixthInterval, seventhInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 2 },
      children: [
        {
          condition: { interval: secondInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        {
          condition: { interval: [thirdInterval, fourthInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: { string: 3 },
      children: [
        { condition: { interval: seventhInterval }, color: toneColor },
        { condition: { interval: '1' }, color: rootColor },
        {
          condition: { interval: secondInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: {
        string: 4,
        interval: [fourthInterval, fifthInterval, sixthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 5 },
      children: [
        { condition: { interval: '1' }, color: rootColor },
        {
          condition: { interval: [secondInterval, thirdInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: {
        string: 6,
        interval: [fifthInterval, sixthInterval, seventhInterval],
      },
      color: toneColor,
    },
  ];
}
makeCaged_AGPosition satisfies MakeCagedPositionFn;

export function makeCaged_GPosition({
  secondInterval,
  thirdInterval,
  fourthInterval,
  fifthInterval,
  sixthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: MakeCagedPositionOptions): PatternRuleNode[] {
  return [
    {
      condition: { string: 1 },
      children: [
        {
          condition: { interval: [sixthInterval, seventhInterval] },
          color: toneColor,
        },
        { condition: { interval: '1' }, color: rootColor },
      ],
    },
    {
      condition: { string: 2 },
      children: [
        {
          condition: { interval: thirdInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        {
          condition: { interval: [fourthInterval, fifthInterval] },
          color: toneColor,
        },
      ],
    },
    {
      condition: { string: 3 },
      children: [
        {
          condition: { interval: seventhInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
        { condition: { interval: '1' }, color: rootColor },
        {
          condition: { interval: secondInterval },
          color: toneColor,
        },
        {
          condition: { interval: thirdInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: { string: 4 },
      children: [
        {
          condition: { interval: [fifthInterval, sixthInterval] },
          color: toneColor,
        },
        {
          condition: { interval: seventhInterval },
          color: toneColor,
          opacity: ALT_OPACITY,
        },
      ],
    },
    {
      condition: {
        string: 5,
        interval: [secondInterval, thirdInterval, fourthInterval],
      },
      color: toneColor,
    },
    {
      condition: { string: 6 },
      children: [
        {
          condition: { interval: [sixthInterval, seventhInterval] },
          color: toneColor,
        },
        { condition: { interval: '1' }, color: rootColor },
      ],
    },
  ];
}
makeCaged_GPosition satisfies MakeCagedPositionFn;
