import { describe, expect, test } from 'vitest';
import { NOTE_TO_NOTE_CLASS } from './music';
import { getMatchingRules, matchesCondition } from './rule-engine';

describe('getMatchingRules', () => {
  test('preserves interval labels from the matching definition rule', () => {
    const matchingRulesResult = getMatchingRules(['A'], 1, 0, 'C', [
      { condition: { interval: 'bb7' }, color: 'BLACK' },
    ]);

    expect(matchingRulesResult).not.toBeNull();
    expect(matchingRulesResult?.matchingRules[0]?.condition.interval).toBe(
      'bb7',
    );
  });

  test('preserves array interval conditions on matching rules', () => {
    const matchingRulesResult = getMatchingRules(['D#'], 1, 0, 'C', [
      { condition: { interval: ['b3', '5'] }, color: 'BLACK' },
    ]);

    expect(matchingRulesResult).not.toBeNull();
    expect(matchingRulesResult?.matchingRules[0]?.condition.interval).toEqual([
      'b3',
      '5',
    ]);
  });
});

describe('matchesCondition', () => {
  test('still matches enharmonic intervals by semitone distance', () => {
    expect(
      matchesCondition(
        { interval: 'bb7' },
        { string: 1, fret: 0, noteClass: NOTE_TO_NOTE_CLASS.A },
        { rootNote: 'C' },
      ),
    ).toBe(true);
  });
});
