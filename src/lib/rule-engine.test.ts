import { describe, expect, test } from 'vitest';
import {
  getDisplayNoteFromRoot,
  getIntervalLabelFromCondition,
  getIntervalLabelFromRoot,
  matchesCondition,
} from './rule-engine';

describe('getDisplayNoteFromRoot', () => {
  test('prefers flat enharmonics when root note is flat', () => {
    expect(getDisplayNoteFromRoot('C#', 'Db')).toBe('Db');
    expect(getDisplayNoteFromRoot('A#', 'Db')).toBe('Bb');
  });

  test('keeps sharp enharmonics when root note is not flat', () => {
    expect(getDisplayNoteFromRoot('C#', 'D')).toBe('C#');
  });
});

describe('getIntervalLabelFromCondition', () => {
  test('returns interval labels from definition instead of canonical semitone label', () => {
    expect(getIntervalLabelFromCondition('A', 'bb7', 'C')).toBe('bb7');
    expect(getIntervalLabelFromRoot('A', 'C')).toBe('6');
  });

  test('resolves interval from array conditions', () => {
    expect(getIntervalLabelFromCondition('D#', ['b3', '5'], 'C')).toBe('b3');
  });
});

describe('matchesCondition', () => {
  test('still matches enharmonic intervals by semitone distance', () => {
    expect(
      matchesCondition(
        { interval: 'bb7' },
        { string: 1, fret: 0, note: 'A' },
        { rootNote: 'C' },
      ),
    ).toBe(true);
  });
});
