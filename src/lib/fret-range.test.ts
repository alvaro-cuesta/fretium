import { describe, expect, test } from 'vitest';
import { INSTRUMENTS } from '../config/instruments';
import { PATTERNS_GROUPED } from '../config/patterns/patterns';
import { calculateFretRange } from './fret-range';
import { getPatternConfigEntryPatternAtPath } from './pattern-config';
import {
  MAX_FRET,
  OCTAVE_FRET,
  TOTAL_FRETS,
  renderPattern,
  type RenderPatternResult,
} from './pattern-engine';

type RenderedNote = NonNullable<
  RenderPatternResult<number>['renderedPattern'][number][number]
>;

const RENDERED_NOTE = {} as RenderedNote;

function createRenderPatternResult(
  props: Partial<RenderPatternResult<number>>,
): RenderPatternResult<number> {
  return {
    renderedPattern: Array.from({ length: TOTAL_FRETS }, () => [
      null,
    ]) as RenderPatternResult<number>['renderedPattern'],
    minFret: 0,
    maxFret: 0,
    isCyclic: false,
    isFullOctave: false,
    ...props,
  };
}

function createCyclicRenderPatternResult(
  occupiedBaseFrets: number[],
  options: {
    isFullOctave?: boolean;
  } = {},
): RenderPatternResult<number> {
  const occupiedFrets = new Set<number>();

  for (const baseFret of occupiedBaseFrets) {
    for (let fret = baseFret; fret <= MAX_FRET; fret += OCTAVE_FRET) {
      occupiedFrets.add(fret);
    }
  }

  return {
    renderedPattern: Array.from({ length: TOTAL_FRETS }, (_, fret) => [
      occupiedFrets.has(fret) ? RENDERED_NOTE : null,
    ]) as RenderPatternResult<number>['renderedPattern'],
    minFret: Math.min(...occupiedBaseFrets),
    maxFret: Math.max(...occupiedBaseFrets),
    isCyclic: true,
    isFullOctave: options.isFullOctave ?? false,
  };
}

describe('calculateFretRange', () => {
  test('chooses the tightest wrapped range for cyclic patterns near the octave', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO',
        end: 'AUTO',
      },
      createCyclicRenderPatternResult([0, 1, 2, 10, 11]),
    );

    expect(fretRange).toEqual({
      start: 10,
      end: 14,
    });
  });

  test('uses the wrapped layout when the start fret is fixed and end is automatic', () => {
    const fretRange = calculateFretRange(
      {
        start: 10,
        end: 'AUTO',
      },
      createCyclicRenderPatternResult([0, 1, 2, 10, 11]),
    );

    expect(fretRange).toEqual({
      start: 10,
      end: 14,
    });
  });

  test('keeps a fixed cyclic start instead of collapsing back to the base-cycle range', () => {
    const fretRange = calculateFretRange(
      {
        start: 14,
        end: 'AUTO',
      },
      createCyclicRenderPatternResult([0, 1, 2, 3]),
    );

    expect(fretRange).toEqual({
      start: 14,
      end: 17,
    });
  });

  test('keeps a fixed cyclic start exact when only a later note is still reachable', () => {
    const fretRange = calculateFretRange(
      {
        start: 16,
        end: 'AUTO',
      },
      createCyclicRenderPatternResult([0, 1, 2, 3]),
    );

    expect(fretRange).toEqual({
      start: 16,
      end: 24,
    });
  });

  test('keeps the screenshot Maj7 G-position fixed start exact with the real pattern data', () => {
    const tuning = INSTRUMENTS.Guitar.tunings['Standard'];
    const pattern = getPatternConfigEntryPatternAtPath(PATTERNS_GROUPED, [
      'arpeggios/maj7',
      'positions/g',
      'base',
    ]);

    if (!tuning) {
      throw new Error('Missing Guitar Standard tuning test fixture');
    }

    if (!pattern) {
      throw new Error('Missing Maj7 G-position pattern test fixture');
    }

    const fretRange = calculateFretRange(
      {
        start: 16,
        end: 'AUTO',
      },
      renderPattern(tuning, pattern, 'F'),
    );

    expect(fretRange).toEqual({
      start: 16,
      end: 24,
    });
  });

  test('treats full-octave cyclic patterns as covering the full octave for auto range selection', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO',
        end: 'AUTO',
      },
      createCyclicRenderPatternResult([1, 3, 5, 7, 8, 10], {
        isFullOctave: true,
      }),
    );

    expect(fretRange).toEqual({
      start: 0,
      end: 12,
    });
  });

  test('expands a 12-fret auto range to the left when the right side is fixed', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO',
        end: 13,
      },
      createRenderPatternResult({
        minFret: 1,
        maxFret: 13,
      }),
    );

    expect(fretRange).toEqual({
      start: 0,
      end: 13,
    });
  });

  test('expands a 12-fret auto range to the right when the left side is fixed', () => {
    const fretRange = calculateFretRange(
      {
        start: 1,
        end: 'AUTO',
      },
      createRenderPatternResult({
        minFret: 0,
        maxFret: 13,
      }),
    );

    expect(fretRange).toEqual({
      start: 1,
      end: 14,
    });
  });

  test('avoids open strings when a compact shifted range is available', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO_AVOID_OPEN',
        end: 'AUTO',
      },
      createCyclicRenderPatternResult([0, 4, 7]),
    );

    expect(fretRange).toEqual({
      start: 12,
      end: 19,
    });
  });

  test('does not avoid open strings with a fixed end when the constrained shifted layout would be longer', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO_AVOID_OPEN',
        end: 12,
      },
      createCyclicRenderPatternResult([0, 1, 2, 3]),
    );

    expect(fretRange).toEqual({
      start: 0,
      end: 12,
    });
  });

  test('shows the second cycle only when it fits under the fixed end fret with a smaller span', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO_AVOID_OPEN',
        end: 16,
      },
      createCyclicRenderPatternResult([0, 1, 2, 3]),
    );

    expect(fretRange).toEqual({
      start: 12,
      end: 16,
    });
  });

  test('falls back to open strings when avoid-open cannot satisfy a fixed end fret', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO_AVOID_OPEN',
        end: 7,
      },
      createCyclicRenderPatternResult([0, 4, 7]),
    );

    expect(fretRange).toEqual({
      start: 0,
      end: 7,
    });
  });

  test('prefers an equivalent open-string layout over collapsing to a single fret', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO_AVOID_OPEN',
        end: 2,
      },
      createCyclicRenderPatternResult([0, 2]),
    );

    expect(fretRange).toEqual({
      start: 0,
      end: 2,
    });
  });

  test('never returns a negative range when a fixed end fret is lower than any valid start', () => {
    const fretRange = calculateFretRange(
      {
        start: 'AUTO_AVOID_OPEN',
        end: 2,
      },
      createCyclicRenderPatternResult([4, 5, 8]),
    );

    expect(fretRange).toEqual({
      start: 2,
      end: 2,
    });
  });
});
