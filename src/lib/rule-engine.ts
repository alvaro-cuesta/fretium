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

type NumberCondition = number | readonly number[] | NumberRangeCondition;

type NoteCondition = Note | readonly Note[];

type RuleCondition = {
  string?: NumberCondition;
  fret?: NumberCondition;
  note?: NoteCondition;
  interval?: LooseInterval | readonly LooseInterval[];
};

export type Rule = {
  condition: RuleCondition;
  color: FretboardNoteColorName;
  opacity?: number;
};

export type RuleDefinition = readonly Rule[];

type RuleContext = {
  string: number;
  fret: number;
  noteClass: NoteClass;
};

type RuleMatchOptions = {
  rootNote: Note;
};

function matchesNumberCondition(
  value: number,
  condition: NumberCondition,
): boolean {
  if (typeof condition === 'number') {
    return condition === value;
  }

  if (Array.isArray(condition)) {
    return condition.includes(value);
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

function matchesIntervalCondition(
  noteClass: NoteClass,
  condition: LooseInterval | readonly LooseInterval[],
  options: RuleMatchOptions,
): boolean {
  const rootNoteClass = NOTE_TO_NOTE_CLASS[options.rootNote];
  const noteSemitonesFromRoot = semitonesToNoteClass(noteClass - rootNoteClass);
  const intervals = typeof condition === 'string' ? [condition] : condition;
  return intervals.some((interval) => {
    return LOOSE_INTERVAL_TO_NOTE_CLASS[interval] === noteSemitonesFromRoot;
  });
}

export function matchesCondition(
  condition: RuleCondition,
  value: RuleContext,
  options: RuleMatchOptions,
): boolean {
  if (
    condition.string !== undefined &&
    !matchesNumberCondition(value.string, condition.string)
  ) {
    return false;
  }

  if (
    condition.fret !== undefined &&
    !matchesNumberCondition(value.fret, condition.fret)
  ) {
    return false;
  }

  if (condition.note !== undefined) {
    const notes: readonly Note[] =
      typeof condition.note === 'string' ? [condition.note] : condition.note;
    const normalizedTargetNotes = notes.map(
      (candidate) => NOTE_TO_NOTE_CLASS[candidate],
    );

    if (!normalizedTargetNotes.includes(value.noteClass)) {
      return false;
    }
  }

  if (
    condition.interval !== undefined &&
    !matchesIntervalCondition(value.noteClass, condition.interval, options)
  ) {
    return false;
  }

  return true;
}

export function getMatchingRules(
  tuning: Tuning<number>,
  stringNumber: number,
  fret: number,
  rootNote: Note,
  definition: RuleDefinition,
) {
  const openNote = tuning[tuning.length - stringNumber];
  if (!openNote) {
    throw new Error(
      `Invalid string number ${stringNumber} for tuning ${tuning.join(',')}`,
    );
  }

  const openNoteClass = NOTE_TO_NOTE_CLASS[openNote];

  const noteClass = semitonesToNoteClass(openNoteClass + fret);

  const matchingRules = definition.filter((rule) =>
    matchesCondition(
      rule.condition,
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

  if (matchingRules.length === 0) {
    return null;
  }

  return {
    noteClass,
    matchingRules,
  };
}

export type GetAppliedRulesResult = {
  noteClass: NoteClass;
  matchingRules: readonly Rule[];
  appliedRules: Omit<Rule, 'condition'>;
};

export function getAppliedRules(
  tuning: Tuning<number>,
  stringNumber: number,
  fret: number,
  rootNote: Note,
  definition: RuleDefinition,
): GetAppliedRulesResult | null {
  const matching = getMatchingRules(
    tuning,
    stringNumber,
    fret,
    rootNote,
    definition,
  );
  if (!matching) {
    return null;
  }

  const { noteClass, matchingRules } = matching;
  const { condition: _condition, ...appliedRules } = matchingRules.reduce(
    (acc, rule) => ({ ...acc, ...rule }),
  );

  return {
    noteClass,
    matchingRules,
    appliedRules,
  };
}
