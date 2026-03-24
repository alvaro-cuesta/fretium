import { clamp } from './math.ts';
import {
  MAX_FRET,
  MIN_FRET,
  OCTAVE_FRET,
  type RenderPatternResult,
} from './pattern-engine.ts';

export type StartFretValue = 'AUTO' | 'AUTO_AVOID_OPEN' | number;

export type EndFretValue = 'AUTO' | number;

export type FretRangeInput = {
  start: StartFretValue;
  end: EndFretValue;
};

type FretRange = {
  start: number;
  end: number;
};

function normalizeFretRange(range: FretRange): FretRange {
  const end = clamp(range.end, MIN_FRET, MAX_FRET);

  return {
    start: clamp(range.start, MIN_FRET, end),
    end,
  };
}

function getExpandedAutoOctaveRange(
  range: FretRange,
  fretRangeInput: FretRangeInput,
  renderPatternResult: RenderPatternResult<number>,
): FretRange {
  if (getFretRangeSpan(range) !== OCTAVE_FRET) {
    return range;
  }

  if (renderPatternResult.isCyclic && renderPatternResult.isFullOctave) {
    return range;
  }

  const hasAutoStart =
    fretRangeInput.start === 'AUTO' ||
    fretRangeInput.start === 'AUTO_AVOID_OPEN';
  const hasAutoEnd = fretRangeInput.end === 'AUTO';

  if (!hasAutoStart && !hasAutoEnd) {
    return range;
  }

  if (!hasAutoEnd && range.start > MIN_FRET) {
    return {
      start: range.start - 1,
      end: range.end,
    };
  }

  if (!hasAutoEnd) {
    return range;
  }

  if (!hasAutoStart && range.end < MAX_FRET) {
    return {
      start: range.start,
      end: range.end + 1,
    };
  }

  if (!hasAutoStart) {
    return range;
  }

  if (range.end < MAX_FRET) {
    return {
      start: range.start,
      end: range.end + 1,
    };
  }

  if (range.start > MIN_FRET) {
    return {
      start: range.start - 1,
      end: range.end,
    };
  }

  return range;
}

function hasRenderedNoteAtFret(
  renderPatternResult: RenderPatternResult<number>,
  fret: number,
): boolean {
  return (
    renderPatternResult.renderedPattern[fret]?.some((note) => note !== null) ??
    false
  );
}

function getCyclicOccupiedFrets(
  renderPatternResult: RenderPatternResult<number>,
): number[] {
  return Array.from({ length: OCTAVE_FRET }, (_, fret) => fret).filter((fret) =>
    hasRenderedNoteAtFret(renderPatternResult, fret),
  );
}

function getFullOctaveCyclicFretRange(options: {
  avoidOpenStrings: boolean;
  start?: number;
  end?: number;
}): FretRange | null {
  if (options.start !== undefined && options.end !== undefined) {
    return options.end - options.start >= OCTAVE_FRET
      ? {
          start: options.start,
          end: options.end,
        }
      : null;
  }

  if (options.start !== undefined) {
    return {
      start: options.start,
      end: Math.min(MAX_FRET, options.start + OCTAVE_FRET),
    };
  }

  if (options.end !== undefined) {
    const start = options.end - OCTAVE_FRET;

    if (options.avoidOpenStrings && start <= MIN_FRET) {
      return null;
    }

    return {
      start: Math.max(MIN_FRET, start),
      end: options.end,
    };
  }

  const start = options.avoidOpenStrings ? OCTAVE_FRET : MIN_FRET;

  return {
    start,
    end: Math.min(MAX_FRET, start + OCTAVE_FRET),
  };
}

function getCyclicFretOccurrences(baseFret: number, avoidOpenStrings: boolean) {
  const frets: number[] = [];

  for (let fret = baseFret; fret <= MAX_FRET; fret += OCTAVE_FRET) {
    if (avoidOpenStrings && fret === MIN_FRET) {
      continue;
    }

    frets.push(fret);
  }

  return frets;
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

function isBetterFretRange(
  candidate: FretRange,
  currentBest: FretRange | null,
) {
  if (!currentBest) {
    return true;
  }

  const candidateSpan = candidate.end - candidate.start;
  const currentBestSpan = currentBest.end - currentBest.start;

  if (candidateSpan !== currentBestSpan) {
    return candidateSpan < currentBestSpan;
  }

  if (candidate.end !== currentBest.end) {
    return candidate.end < currentBest.end;
  }

  return candidate.start < currentBest.start;
}

function getFretRangeSpan(range: FretRange): number {
  return range.end - range.start;
}

function getOpenStringEquivalentCompactRange(
  renderPatternResult: RenderPatternResult<number>,
): FretRange | null {
  if (
    !renderPatternResult.isFullOctave &&
    !hasRenderedNoteAtFret(renderPatternResult, MIN_FRET)
  ) {
    return null;
  }

  return getCompactCyclicFretRange(renderPatternResult, {
    avoidOpenStrings: false,
    start: MIN_FRET,
  });
}

function getCompactCyclicFretRange(
  renderPatternResult: RenderPatternResult<number>,
  options: {
    avoidOpenStrings: boolean;
    start?: number;
    end?: number;
  },
): FretRange | null {
  if (renderPatternResult.isFullOctave) {
    return getFullOctaveCyclicFretRange(options);
  }

  const occupiedFrets = getCyclicOccupiedFrets(renderPatternResult);

  if (occupiedFrets.length === 0) {
    return {
      start: MIN_FRET,
      end: MIN_FRET,
    };
  }

  const fretOccurrences = occupiedFrets.map((fret) =>
    getCyclicFretOccurrences(fret, options.avoidOpenStrings),
  );

  if (fretOccurrences.some((occurrences) => occurrences.length === 0)) {
    return null;
  }

  if (options.start !== undefined && options.end !== undefined) {
    const start = options.start;
    const end = options.end;
    const selectedFrets = fretOccurrences.map((occurrences) =>
      occurrences.find((fret) => fret >= start && fret <= end),
    );

    if (!selectedFrets.every(isDefined)) {
      return null;
    }

    return {
      start,
      end,
    };
  }

  if (options.start !== undefined) {
    const start = options.start;
    const selectedFrets = fretOccurrences.map((occurrences) =>
      occurrences.find((fret) => fret >= start),
    );

    if (!selectedFrets.every(isDefined)) {
      return null;
    }

    return {
      start,
      end: Math.max(...selectedFrets),
    };
  }

  if (options.end !== undefined) {
    const end = options.end;
    const selectedFrets = fretOccurrences.map((occurrences) =>
      occurrences.findLast((fret) => fret <= end),
    );

    if (!selectedFrets.every(isDefined)) {
      return null;
    }

    return {
      start: Math.min(...selectedFrets),
      end,
    };
  }

  const candidateStarts = [...new Set(fretOccurrences.flat())];
  let bestRange: FretRange | null = null;

  for (const candidateStart of candidateStarts) {
    const selectedFrets = fretOccurrences.map((occurrences) =>
      occurrences.find((fret) => fret >= candidateStart),
    );

    if (!selectedFrets.every(isDefined)) {
      continue;
    }

    const candidateRange = {
      start: candidateStart,
      end: Math.max(...selectedFrets),
    };

    if (isBetterFretRange(candidateRange, bestRange)) {
      bestRange = candidateRange;
    }
  }

  return bestRange;
}

function getAutomaticCyclicFretRange(
  renderPatternResult: RenderPatternResult<number>,
  options: {
    avoidOpenStrings: boolean;
    start?: number;
    end?: number;
  },
): FretRange | null {
  const openStringRange = getCompactCyclicFretRange(renderPatternResult, {
    ...options,
    avoidOpenStrings: false,
  });
  const openStringCompactRange =
    getOpenStringEquivalentCompactRange(renderPatternResult);
  const openStringEquivalentRange =
    options.end !== undefined
      ? getCompactCyclicFretRange(renderPatternResult, {
          avoidOpenStrings: false,
          start: MIN_FRET,
          end: options.end,
        })
      : openStringCompactRange;

  if (!options.avoidOpenStrings) {
    return openStringRange;
  }

  const avoidOpenCompactRange = getCompactCyclicFretRange(renderPatternResult, {
    avoidOpenStrings: true,
  });

  const shouldPreferAvoidOpen =
    avoidOpenCompactRange !== null &&
    (openStringCompactRange === null ||
      getFretRangeSpan(avoidOpenCompactRange) <=
        getFretRangeSpan(openStringCompactRange));

  if (!shouldPreferAvoidOpen) {
    return openStringEquivalentRange ?? openStringRange;
  }

  const constrainedAvoidOpenRange = getCompactCyclicFretRange(
    renderPatternResult,
    options,
  );

  if (
    constrainedAvoidOpenRange !== null &&
    (options.end === undefined ||
      constrainedAvoidOpenRange.start >= avoidOpenCompactRange.start)
  ) {
    return constrainedAvoidOpenRange;
  }

  return openStringEquivalentRange ?? openStringRange;
}

function getInformativeFretRangeFallback(
  fretRangeInput: FretRangeInput,
  renderPatternResult: RenderPatternResult<number>,
): FretRange | null {
  if (
    fretRangeInput.start !== 'AUTO_AVOID_OPEN' ||
    fretRangeInput.end === 'AUTO' ||
    !renderPatternResult.isCyclic
  ) {
    return null;
  }

  const openStringRange = getCompactCyclicFretRange(renderPatternResult, {
    avoidOpenStrings: false,
    end: fretRangeInput.end,
  });

  if (openStringRange?.start !== MIN_FRET) {
    return null;
  }

  return openStringRange;
}

function getFixedStartCyclicFallbackRange(
  start: number,
  renderPatternResult: RenderPatternResult<number>,
): FretRange | null {
  const cycleSpan = renderPatternResult.maxFret - renderPatternResult.minFret;
  const end = Math.min(MAX_FRET, start + cycleSpan);
  const hasVisibleNote = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  ).some((fret) => hasRenderedNoteAtFret(renderPatternResult, fret));

  if (hasVisibleNote) {
    return {
      start,
      end,
    };
  }

  const visibleFrets = Array.from(
    { length: MAX_FRET - start + 1 },
    (_, index) => start + index,
  ).filter((fret) => hasRenderedNoteAtFret(renderPatternResult, fret));

  return {
    start,
    end: visibleFrets[0] ?? start,
  };
}

export function calculateFretRange(
  fretRangeInput: FretRangeInput,
  renderPatternResult: RenderPatternResult<number>,
): FretRange {
  let range: FretRange;

  if (fretRangeInput.start === 'AUTO') {
    if (fretRangeInput.end === 'AUTO') {
      range = renderPatternResult.isCyclic
        ? (getAutomaticCyclicFretRange(renderPatternResult, {
            avoidOpenStrings: false,
          }) ?? {
            start: renderPatternResult.minFret,
            end: renderPatternResult.maxFret,
          })
        : {
            start: renderPatternResult.minFret,
            end: renderPatternResult.maxFret,
          };
    } else {
      range = renderPatternResult.isCyclic
        ? (getAutomaticCyclicFretRange(renderPatternResult, {
            avoidOpenStrings: false,
            end: fretRangeInput.end,
          }) ?? {
            start: renderPatternResult.minFret,
            end: fretRangeInput.end,
          })
        : {
            start: renderPatternResult.minFret,
            end: fretRangeInput.end,
          };
    }
  } else if (fretRangeInput.start === 'AUTO_AVOID_OPEN') {
    if (fretRangeInput.end === 'AUTO') {
      range = renderPatternResult.isCyclic
        ? (getAutomaticCyclicFretRange(renderPatternResult, {
            avoidOpenStrings: true,
          }) ?? {
            start: renderPatternResult.minFret,
            end: renderPatternResult.maxFret,
          })
        : {
            start: renderPatternResult.minFret,
            end: renderPatternResult.maxFret,
          };
    } else {
      range = renderPatternResult.isCyclic
        ? (getAutomaticCyclicFretRange(renderPatternResult, {
            avoidOpenStrings: true,
            end: fretRangeInput.end,
          }) ?? {
            start: renderPatternResult.minFret,
            end: fretRangeInput.end,
          })
        : {
            start: renderPatternResult.minFret,
            end: fretRangeInput.end,
          };
    }
  } else if (fretRangeInput.end === 'AUTO') {
    range = renderPatternResult.isCyclic
      ? (getAutomaticCyclicFretRange(renderPatternResult, {
          avoidOpenStrings: false,
          start: fretRangeInput.start,
        }) ?? {
          start: fretRangeInput.start,
          end: renderPatternResult.maxFret,
        })
      : {
          start: fretRangeInput.start,
          end: renderPatternResult.maxFret,
        };
  } else {
    range = {
      start: fretRangeInput.start,
      end: fretRangeInput.end,
    };
  }

  if (range.start > range.end) {
    return normalizeFretRange(
      getExpandedAutoOctaveRange(
        getInformativeFretRangeFallback(fretRangeInput, renderPatternResult) ??
          (renderPatternResult.isCyclic && fretRangeInput.end === 'AUTO'
            ? (getFixedStartCyclicFallbackRange(
                range.start,
                renderPatternResult,
              ) ?? range)
            : range),
        fretRangeInput,
        renderPatternResult,
      ),
    );
  }

  return normalizeFretRange(
    getExpandedAutoOctaveRange(range, fretRangeInput, renderPatternResult),
  );
}
