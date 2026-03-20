// @todo if someone ever needs microtonal instruments, support them!

import type { TupleOf } from 'type-fest';
import type { Note } from './music';

type Instrument<TNumStrings extends number> = {
  strings: TNumStrings;
  tunings: Record<string, Tuning<TNumStrings>>;
};

export type Tuning<TNumStrings extends number> = TupleOf<TNumStrings, Note>;

// This is here just to help with the inference, to ensure that the `strings` property of the instrument matches the length of the tunings.
// It doesn't actually do anything at runtime.
function defineInstrument<const TNumStrings extends number>(
  instrument: Instrument<TNumStrings>,
): Instrument<TNumStrings> {
  return instrument;
}

// @todo This isn't correctly typechecking that `openStrings` has the same number of strings as `strings`
export const INSTRUMENTS = {
  Guitar: defineInstrument({
    strings: 6,
    tunings: {
      Standard: ['E', 'A', 'D', 'G', 'B', 'E'],
      'Drop D': ['D', 'A', 'D', 'G', 'B', 'E'],
    },
  }),
  Bass: defineInstrument({
    strings: 4,
    tunings: {
      Standard: ['E', 'A', 'D', 'G'],
      'Drop D': ['D', 'A', 'D', 'G'],
    },
  }),
  Ukulele: defineInstrument({
    strings: 4,
    tunings: {
      Standard: ['G', 'C', 'E', 'A'],
    },
  }),
  Mandolin: defineInstrument({
    strings: 8,
    tunings: {
      Standard: ['G', 'D', 'A', 'E', 'G', 'D', 'A', 'E'],
    },
  }),
};
