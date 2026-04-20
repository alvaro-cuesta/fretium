import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { PATTERNS_ARPEGGIOS } from './arpeggios';
import { PATTERNS_CHORDS_TETRADS } from './chords-tetrads';
import { PATTERNS_HEPTATONIC } from './heptatonic';
import { PATTERNS_PENTATONIC } from './pentatonic';

export const PATTERNS_GROUPED = {
  type: 'sublist',
  displayName: 'Pattern',
  entries: {
    pentatonic: PATTERNS_PENTATONIC,
    heptatonic: PATTERNS_HEPTATONIC,
    arpeggios: PATTERNS_ARPEGGIOS,
    'chords-tetrads': PATTERNS_CHORDS_TETRADS,
  },
} as const satisfies PatternConfigEntryList;
