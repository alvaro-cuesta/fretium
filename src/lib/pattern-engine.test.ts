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

  describe('falsy conditions', () => {
    test('disabled rules do not appear in matching pattern rules', () => {
      const result = getMatchingPatternRules(['A'], 1, 0, 'C', {
        rules: [
          { condition: { interval: false }, color: 'BLACK' },
          { condition: { interval: '6' }, color: 'WHITE' },
        ],
      });

      expect(result?.matchingPatternRules).toHaveLength(1);
      expect(result?.matchingPatternRules[0]?.color).toBe('WHITE');
    });

    test("children inherit a parent's falsy field and stay disabled", () => {
      const result = getMatchingPatternRules(['A'], 1, 0, 'C', {
        rules: [
          {
            condition: { string: false },
            children: [{ condition: { interval: '6' }, color: 'BLACK' }],
          },
          { condition: { interval: '6' }, color: 'WHITE' },
        ],
      });

      expect(result?.matchingPatternRules).toHaveLength(1);
      expect(result?.matchingPatternRules[0]?.color).toBe('WHITE');
    });

    test("a child's non-falsy field can override a parent's falsy field", () => {
      const result = getMatchingPatternRules(['A'], 1, 0, 'C', {
        rules: [
          {
            condition: { interval: false },
            children: [{ condition: { interval: '6' }, color: 'WHITE' }],
          },
        ],
      });

      expect(result?.matchingPatternRules).toHaveLength(1);
      expect(result?.matchingPatternRules[0]?.color).toBe('WHITE');
    });
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

  // A on a single-A-string tuning at fret 0 is the major 6th of C — used as the
  // baseline note for the falsy-sentinel tests below.
  describe('falsy conditions', () => {
    const context = {
      string: 1,
      fret: 0,
      noteClass: NOTE_TO_NOTE_CLASS.A,
    };
    const options = { rootNote: 'C' } as const;

    test('omitted keys leave the rule unrestricted', () => {
      expect(matchesPatternCondition({}, context, options)).toBe(true);
    });

    test('a falsy scalar disables the rule on any field', () => {
      for (const value of [false, null, undefined] as const) {
        expect(
          matchesPatternCondition({ interval: value }, context, options),
        ).toBe(false);
        expect(
          matchesPatternCondition({ string: value }, context, options),
        ).toBe(false);
        expect(matchesPatternCondition({ fret: value }, context, options)).toBe(
          false,
        );
        expect(matchesPatternCondition({ note: value }, context, options)).toBe(
          false,
        );
      }
    });

    test('falsy entries are filtered from arrays', () => {
      expect(
        matchesPatternCondition(
          { interval: ['6', false, '7'] },
          context,
          options,
        ),
      ).toBe(true);
      expect(
        matchesPatternCondition(
          { interval: ['2', false, '5'] },
          context,
          options,
        ),
      ).toBe(false);
      expect(
        matchesPatternCondition({ string: [null, 1, false] }, context, options),
      ).toBe(true);
      expect(
        matchesPatternCondition({ string: [null, 2, false] }, context, options),
      ).toBe(false);
    });

    test('all-falsy arrays disable the rule', () => {
      expect(
        matchesPatternCondition(
          { interval: [false, null, undefined] },
          context,
          options,
        ),
      ).toBe(false);
      expect(
        matchesPatternCondition(
          { string: [false, null, undefined] },
          context,
          options,
        ),
      ).toBe(false);
    });
  });
});
