import type { Instrument } from '../lib/instrument';

// This is here just to help with the inference, to ensure that the `strings` property of the instrument matches the length of the tunings.
// It doesn't actually do anything at runtime.
function defineInstrument<const TNumStrings extends number>(
  instrument: Instrument<TNumStrings>,
): Instrument<TNumStrings> {
  return instrument;
}

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
