import { describe, expect, test } from 'vitest';
import { NOTE_TO_NOTE_CLASS } from './music';
import {
  getMatchingPatternRules,
  matchesPatternCondition,
  renderPattern,
} from './pattern-engine';

describe('getMatchingPatternRules', () => {
  test('preserves interval labels from the matching pattern rule', () => {
    const matchingPatternRulesResult = getMatchingPatternRules(
      ['A'],
      1,
      0,
      'C',
      { rules: [{ condition: { interval: 'bb7' }, color: 'BLACK' }] },
    );

    expect(matchingPatternRulesResult).not.toBeNull();
    expect(
      matchingPatternRulesResult?.matchingPatternRules[0]?.condition.interval,
    ).toBe('bb7');
  });

  test('preserves array interval conditions on matching rules', () => {
    const matchingPatternRulesResult = getMatchingPatternRules(
      ['D#'],
      1,
      0,
      'C',
      { rules: [{ condition: { interval: ['b3', '5'] }, color: 'BLACK' }] },
    );

    expect(matchingPatternRulesResult).not.toBeNull();
    expect(
      matchingPatternRulesResult?.matchingPatternRules[0]?.condition.interval,
    ).toEqual(['b3', '5']);
  });
});

describe('matchesPatternCondition', () => {
  test('still matches enharmonic intervals by semitone distance', () => {
    expect(
      matchesPatternCondition(
        { interval: 'bb7' },
        { string: 1, fret: 0, noteClass: NOTE_TO_NOTE_CLASS.A },
        { rootNote: 'C' },
      ),
    ).toBe(true);
  });

  test('preserves full-octave metadata in rendered pattern results', () => {
    const result = renderPattern(
      ['C'],
      {
        rules: [{ condition: { note: 'C#' }, color: 'BLACK' }],
        isFullOctave: true,
      },
      'C',
    );

    expect(result.isFullOctave).toBe(true);
    expect(result.minFret).toBe(0);
    expect(result.maxFret).toBe(12);
  });
});
