import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { PATTERNS_ARPEGGIOS } from './arpeggios';
import { PATTERNS_CHORDS_TETRADS } from './chords-tetrads';
import { PATTERNS_HEPTATONIC } from './heptatonic';

export const PATTERNS_GROUPED = {
  type: 'sublist',
  displayName: 'Pattern',
  entries: {
    heptatonic: PATTERNS_HEPTATONIC,
    arpeggios: PATTERNS_ARPEGGIOS,
    'chords-tetrads': PATTERNS_CHORDS_TETRADS,
  },
} as const satisfies PatternConfigEntryList;
