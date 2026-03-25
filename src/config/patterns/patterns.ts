import type { PatternConfigEntryList } from '../../lib/pattern-config';
import { PATTERNS_ARPEGGIOS } from './arpeggios';
import { PATTERNS_CHORDS_TETRADS } from './chords-tetrads';
import { PATTERNS_SCALES } from './scales';
import { PATTERNS_SCALES_MODES } from './scales-modes';

export const PATTERNS_GROUPED = {
  type: 'sublist',
  displayName: 'Pattern',
  entries: {
    scales: PATTERNS_SCALES,
    modes: PATTERNS_SCALES_MODES,
    arpeggios: PATTERNS_ARPEGGIOS,
    'chords-tetrads': PATTERNS_CHORDS_TETRADS,
  },
} as const satisfies PatternConfigEntryList;
