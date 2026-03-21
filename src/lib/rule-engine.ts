import type { FretboardNoteColorName } from '../components/Fretboard/theme';
import type { Note } from './music';

const SHARP_NOTES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

type SharpNote = (typeof SHARP_NOTES)[number];

const FLAT_TO_SHARP: Readonly<Record<string, SharpNote>> = {
  CB: 'B',
  DB: 'C#',
  EB: 'D#',
  FB: 'E',
  GB: 'F#',
  AB: 'G#',
  BB: 'A#',
  'E#': 'F',
  'B#': 'C',
};

const DEFAULT_INTERVAL_ROOT: SharpNote = 'C';
const SEMITONE_INTERVAL_LABELS = [
  '1',
  'b2',
  '2',
  'b3',
  '3',
  '4',
  'b5',
  '5',
  'b6',
  '6',
  'b7',
  '7',
] as const;
const FLAT_NOTES_BY_SHARP: Readonly<Record<SharpNote, Note>> = {
  C: 'C',
  'C#': 'Db',
  D: 'D',
  'D#': 'Eb',
  E: 'E',
  F: 'F',
  'F#': 'Gb',
  G: 'G',
  'G#': 'Ab',
  A: 'A',
  'A#': 'Bb',
  B: 'B',
};

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
  interval?: string | readonly string[];
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
  note: SharpNote;
};

type RuleMatchOptions = {
  rootNote?: Note | undefined;
};

function normalizeNote(note: string): SharpNote | null {
  const upper = note.trim().toUpperCase();
  if (SHARP_NOTES.includes(upper as SharpNote)) {
    return upper as SharpNote;
  }

  return FLAT_TO_SHARP[upper] ?? null;
}

export function transposeNote(
  root: string,
  semitones: number,
): SharpNote | null {
  const normalized = normalizeNote(root);
  if (!normalized) {
    return null;
  }

  const rootIndex = SHARP_NOTES.indexOf(normalized);
  const nextIndex =
    (((rootIndex + semitones) % SHARP_NOTES.length) + SHARP_NOTES.length) %
    SHARP_NOTES.length;

  return SHARP_NOTES[nextIndex] ?? null;
}

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

function parseIntervalToSemitones(interval: string): number | null {
  const trimmed = interval.trim();
  const match = /^([b#]*)(\d+)$/.exec(trimmed);
  if (!match?.[2]) {
    return null;
  }

  const accidentals = match[1] ?? '';
  const degree = Number(match[2]);
  if (!Number.isInteger(degree) || degree <= 0) {
    return null;
  }

  const degreeWithinOctave = ((degree - 1) % 7) + 1;
  const octaveOffset = Math.floor((degree - 1) / 7) * 12;
  const baseWithinOctaveByDegree: Record<number, number> = {
    1: 0,
    2: 2,
    3: 4,
    4: 5,
    5: 7,
    6: 9,
    7: 11,
  };
  const baseWithinOctave = baseWithinOctaveByDegree[degreeWithinOctave];
  if (baseWithinOctave === undefined) {
    return null;
  }

  const accidentalOffset = Array.from(accidentals).reduce(
    (offset, accidental) => {
      if (accidental === 'b') {
        return offset - 1;
      }
      if (accidental === '#') {
        return offset + 1;
      }

      return offset;
    },
    0,
  );

  return octaveOffset + baseWithinOctave + accidentalOffset;
}

function toSemitonesWithinOctave(semitones: number): number {
  return (
    ((semitones % SHARP_NOTES.length) + SHARP_NOTES.length) % SHARP_NOTES.length
  );
}

function shouldPreferFlatNoteNames(rootNote?: Note): boolean {
  if (!rootNote) {
    return false;
  }

  return rootNote.includes('b');
}

function matchesIntervalCondition(
  note: SharpNote,
  condition: string | readonly string[],
  options?: RuleMatchOptions,
): boolean {
  const normalizedRoot = normalizeNote(
    options?.rootNote ?? DEFAULT_INTERVAL_ROOT,
  );
  if (!normalizedRoot) {
    return false;
  }

  const rootIndex = SHARP_NOTES.indexOf(normalizedRoot);
  const noteIndex = SHARP_NOTES.indexOf(note);
  if (rootIndex < 0 || noteIndex < 0) {
    return false;
  }

  const noteSemitonesFromRoot =
    (noteIndex - rootIndex + SHARP_NOTES.length) % SHARP_NOTES.length;
  const intervals: readonly string[] =
    typeof condition === 'string' ? [condition] : condition;

  return intervals.some((interval) => {
    const semitones = parseIntervalToSemitones(interval);
    if (semitones === null) {
      return false;
    }

    return (
      ((semitones % SHARP_NOTES.length) + SHARP_NOTES.length) %
        SHARP_NOTES.length ===
      noteSemitonesFromRoot
    );
  });
}

export function getIntervalLabelFromRoot(
  note: string,
  rootNote?: Note,
): (typeof SEMITONE_INTERVAL_LABELS)[number] | null {
  const normalizedRoot = normalizeNote(rootNote ?? DEFAULT_INTERVAL_ROOT);
  const normalizedNote = normalizeNote(note);
  if (!normalizedRoot || !normalizedNote) {
    return null;
  }

  const rootIndex = SHARP_NOTES.indexOf(normalizedRoot);
  const noteIndex = SHARP_NOTES.indexOf(normalizedNote);
  if (rootIndex < 0 || noteIndex < 0) {
    return null;
  }

  const semitonesFromRoot =
    (noteIndex - rootIndex + SHARP_NOTES.length) % SHARP_NOTES.length;
  return SEMITONE_INTERVAL_LABELS[semitonesFromRoot] ?? null;
}

export function getIntervalLabelFromCondition(
  note: string,
  condition: string | readonly string[],
  rootNote?: Note,
): string | null {
  const normalizedRoot = normalizeNote(rootNote ?? DEFAULT_INTERVAL_ROOT);
  const normalizedNote = normalizeNote(note);
  if (!normalizedRoot || !normalizedNote) {
    return null;
  }

  const rootIndex = SHARP_NOTES.indexOf(normalizedRoot);
  const noteIndex = SHARP_NOTES.indexOf(normalizedNote);
  if (rootIndex < 0 || noteIndex < 0) {
    return null;
  }

  const noteSemitonesFromRoot = toSemitonesWithinOctave(noteIndex - rootIndex);
  const intervals: readonly string[] =
    typeof condition === 'string' ? [condition] : condition;

  for (const interval of intervals) {
    const semitones = parseIntervalToSemitones(interval);
    if (semitones === null) {
      continue;
    }

    if (toSemitonesWithinOctave(semitones) === noteSemitonesFromRoot) {
      return interval.trim();
    }
  }

  return null;
}

export function getDisplayNoteFromRoot(
  note: string,
  rootNote?: Note,
): Note | null {
  const normalizedNote = normalizeNote(note);
  if (!normalizedNote) {
    return null;
  }

  if (shouldPreferFlatNoteNames(rootNote)) {
    return FLAT_NOTES_BY_SHARP[normalizedNote];
  }

  return normalizedNote;
}

export function matchesCondition(
  condition: RuleCondition,
  value: RuleContext,
  options?: RuleMatchOptions,
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
    const normalizedTargetNotes = notes
      .map((candidate) => normalizeNote(candidate))
      .filter((candidate): candidate is SharpNote => candidate !== null);

    if (!normalizedTargetNotes.includes(value.note)) {
      return false;
    }
  }

  if (
    condition.interval !== undefined &&
    !matchesIntervalCondition(value.note, condition.interval, options)
  ) {
    return false;
  }

  return true;
}
