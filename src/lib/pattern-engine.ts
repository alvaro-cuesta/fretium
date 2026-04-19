import { isEqual } from '@ver0/deep-equal';
import type { TupleOf } from 'type-fest';
import { chunks, findIndex, findLastIndex } from '../../lib/array';
import type { FretboardNoteColorName } from '../components/Fretboard/theme';
import type { Tuning } from './instrument';
import {
  LOOSE_INTERVAL_TO_NOTE_CLASS,
  NOTE_TO_NOTE_CLASS,
  semitonesToNoteClass,
  type LooseInterval,
  type Note,
  type NoteClass,
} from './music';

type NumberRangeCondition = {
  gte?: number;
  lte?: number;
};

// `false`/`null`/`undefined` as a field value (or as an array entry within a field) means
// "this part of the condition is ignored". For a scalar field that disables the whole rule;
// for an array the falsy entries are filtered out, and an all-falsy array ends up empty which
// also disables the rule. Convenient for writing conditional patterns like
// `interval: someFlag ? '2' : false` without having to split rules across branches.
type Falsy = false | null | undefined;

type NumberCondition =
  | number
  | readonly (number | Falsy)[]
  | NumberRangeCondition
  | Falsy;

type NoteCondition = Note | readonly (Note | Falsy)[] | Falsy;

type IntervalCondition =
  | LooseInterval
  | readonly (LooseInterval | Falsy)[]
  | Falsy;

type PatternRuleCondition = {
  string?: NumberCondition;
  fret?: NumberCondition;
  note?: NoteCondition;
  interval?: IntervalCondition;
};

function isFalsySentinel(value: unknown): value is Falsy {
  return value === false || value === null || value === undefined;
}

export type PatternRule = {
  condition: PatternRuleCondition;
  color: FretboardNoteColorName;
  opacity?: number;
};

export type PatternRuleGroup = {
  condition: PatternRuleCondition;
  children: readonly PatternRuleNode[];
};

export type PatternRuleNode = PatternRule | PatternRuleGroup;

export type Pattern = {
  rules: readonly PatternRuleNode[];
  isFullOctave?: boolean | undefined;
};

// Rule arrays are defined at module scope in config files, so they're referentially stable —
// caching by identity lets us flatten each pattern exactly once across all per-note lookups.
const flattenedRulesCache = new WeakMap<
  readonly PatternRuleNode[],
  readonly PatternRule[]
>();

function flattenPatternRuleNodes(
  nodes: readonly PatternRuleNode[],
  parentCondition: PatternRuleCondition,
  out: PatternRule[],
): void {
  for (const node of nodes) {
    const mergedCondition = { ...parentCondition, ...node.condition };
    if ('children' in node) {
      flattenPatternRuleNodes(node.children, mergedCondition, out);
    } else {
      out.push({ ...node, condition: mergedCondition });
    }
  }
}

function getFlattenedPatternRules(
  rules: readonly PatternRuleNode[],
): readonly PatternRule[] {
  const cached = flattenedRulesCache.get(rules);
  if (cached !== undefined) {
    return cached;
  }
  const flattened: PatternRule[] = [];
  flattenPatternRuleNodes(rules, {}, flattened);
  flattenedRulesCache.set(rules, flattened);
  return flattened;
}

type PatternContext = {
  string: number;
  fret: number;
  noteClass: NoteClass;
};

type PatternMatchOptions = {
  rootNote: Note;
};

function matchesNumberCondition(
  value: number,
  condition: Exclude<NumberCondition, Falsy>,
): boolean {
  if (typeof condition === 'number') {
    return condition === value;
  }

  if (Array.isArray(condition)) {
    return condition.some(
      (entry): entry is number => !isFalsySentinel(entry) && entry === value,
    );
  }

  const rangeCondition = condition as NumberRangeCondition;

  if (rangeCondition.gte !== undefined && value < rangeCondition.gte) {
    return false;
  }

  if (rangeCondition.lte !== undefined && value > rangeCondition.lte) {
    return false;
  }

  return true;
}

function matchesNoteCondition(
  noteClass: NoteClass,
  condition: Exclude<NoteCondition, Falsy>,
): boolean {
  const candidates = typeof condition === 'string' ? [condition] : condition;
  return candidates.some(
    (candidate) =>
      !isFalsySentinel(candidate) &&
      NOTE_TO_NOTE_CLASS[candidate] === noteClass,
  );
}

function matchesIntervalCondition(
  noteClass: NoteClass,
  condition: Exclude<IntervalCondition, Falsy>,
  options: PatternMatchOptions,
): boolean {
  const rootNoteClass = NOTE_TO_NOTE_CLASS[options.rootNote];
  const noteSemitonesFromRoot = semitonesToNoteClass(noteClass - rootNoteClass);
  const intervals = typeof condition === 'string' ? [condition] : condition;
  return intervals.some(
    (interval) =>
      !isFalsySentinel(interval) &&
      LOOSE_INTERVAL_TO_NOTE_CLASS[interval] === noteSemitonesFromRoot,
  );
}

export function matchesPatternCondition(
  condition: PatternRuleCondition,
  value: PatternContext,
  options: PatternMatchOptions,
): boolean {
  if ('string' in condition) {
    if (isFalsySentinel(condition.string)) return false;
    if (!matchesNumberCondition(value.string, condition.string)) return false;
  }

  if ('fret' in condition) {
    if (isFalsySentinel(condition.fret)) return false;
    if (!matchesNumberCondition(value.fret, condition.fret)) return false;
  }

  if ('note' in condition) {
    if (isFalsySentinel(condition.note)) return false;
    if (!matchesNoteCondition(value.noteClass, condition.note)) return false;
  }

  if ('interval' in condition) {
    if (isFalsySentinel(condition.interval)) return false;
    if (
      !matchesIntervalCondition(value.noteClass, condition.interval, options)
    ) {
      return false;
    }
  }

  return true;
}

export function getMatchingPatternRules(
  tuning: Tuning<number>,
  stringNumber: number,
  fret: number,
  rootNote: Note,
  pattern: Pattern,
) {
  const openNote = tuning[tuning.length - stringNumber];
  if (!openNote) {
    throw new Error(
      `Invalid string number ${stringNumber} for tuning ${tuning.join(',')}`,
    );
  }

  const openNoteClass = NOTE_TO_NOTE_CLASS[openNote];

  const noteClass = semitonesToNoteClass(openNoteClass + fret);

  const matchingPatternRules = getFlattenedPatternRules(pattern.rules).filter(
    (patternRule) =>
      matchesPatternCondition(
        patternRule.condition,
        {
          string: stringNumber,
          fret,
          noteClass,
        },
        {
          rootNote,
        },
      ),
  );

  if (matchingPatternRules.length === 0) {
    return null;
  }

  return {
    noteClass,
    matchingPatternRules,
  };
}

export type GetAppliedPatternRulesResult = {
  noteClass: NoteClass;
  matchingPatternRules: readonly PatternRule[];
  appliedPatternRule: Omit<PatternRule, 'condition'>;
};

export function getAppliedPatternRules(
  tuning: Tuning<number>,
  stringNumber: number,
  fret: number,
  rootNote: Note,
  pattern: Pattern,
): GetAppliedPatternRulesResult | null {
  const matching = getMatchingPatternRules(
    tuning,
    stringNumber,
    fret,
    rootNote,
    pattern,
  );
  if (!matching) {
    return null;
  }

  const { noteClass, matchingPatternRules } = matching;
  const { condition: _condition, ...appliedPatternRule } =
    matchingPatternRules.reduce((acc, patternRule) => ({
      ...acc,
      ...patternRule,
    }));

  return {
    noteClass,
    matchingPatternRules,
    appliedPatternRule,
  };
}

export const MIN_FRET = 0 as const;
export const OCTAVE_FRET = 12 as const;
export const MAX_FRET = 24 as const;
export const TOTAL_FRETS =
  // +1 to include open strings
  // (MAX_FRET + 1) as const;
  25 as const;

type RenderedPattern<TNumString extends number> = TupleOf<
  typeof TOTAL_FRETS,
  TupleOf<TNumString, GetAppliedPatternRulesResult | null>
>;

export type RenderPatternResult<TNumString extends number> = {
  renderedPattern: RenderedPattern<TNumString>;
  minFret: number;
  maxFret: number;
  isCyclic: boolean;
  isFullOctave: boolean;
};

export function renderPattern<TNumString extends number>(
  tuning: Tuning<TNumString>,
  pattern: Pattern,
  rootNote: Note,
): RenderPatternResult<TNumString> {
  const renderedPattern = Array.from({ length: TOTAL_FRETS }, (_, fret) =>
    Array.from({ length: tuning.length }, (_, stringIndex) => {
      const stringNumber = stringIndex + 1;
      return getAppliedPatternRules(
        tuning,
        stringNumber,
        fret,
        rootNote,
        pattern,
      );
    }),
  ) as RenderedPattern<TNumString>;

  const octaves = chunks(renderedPattern, OCTAVE_FRET);
  const isCyclic =
    // A pattern is cyclic if all octaves are identical to each other
    // Takes into account partial octaves too
    octaves.every((octave) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- first octave always exists
      isEqual(octave, octaves[0]!.slice(0, octave.length)),
    );

  const isFullOctave = pattern.isFullOctave === true;

  const minimalRenderedPattern = isCyclic
    ? renderedPattern.slice(0, OCTAVE_FRET)
    : renderedPattern;

  const minFret =
    isCyclic && isFullOctave
      ? MIN_FRET
      : (findIndex(minimalRenderedPattern, (fret) =>
          fret.some((note) => note !== null),
        ) ?? MIN_FRET);
  const maxFret =
    isCyclic && isFullOctave
      ? OCTAVE_FRET
      : (findLastIndex(minimalRenderedPattern, (fret) =>
          fret.some((note) => note !== null),
        ) ?? MIN_FRET);

  return {
    renderedPattern,
    minFret,
    maxFret,
    isCyclic,
    isFullOctave,
  };
}
