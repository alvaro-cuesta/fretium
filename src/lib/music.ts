export const NOTES = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
] as const;

export type Note = (typeof NOTES)[number];

export type NoteClass =
  | 0 // C
  | 1 // C#/Db
  | 2 // D
  | 3 // D#/Eb
  | 4 // E
  | 5 // F
  | 6 // F#/Gb
  | 7 // G
  | 8 // G#/Ab
  | 9 // A
  | 10 // A#/Bb
  | 11; // B

export const NOTE_TO_NOTE_CLASS: Record<Note, NoteClass> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

export function semitonesToNoteClass(semitones: number): NoteClass {
  return (((semitones % 12) + 12) % 12) as NoteClass;
}

export type Interval =
  | 'P1'
  | 'd2'
  | 'm2'
  | 'A1'
  | 'S'
  | 'M2'
  | 'd3'
  | 'T'
  | 'm3'
  | 'A2'
  | 'M3'
  | 'd4'
  | 'P4'
  | 'A3'
  | 'd5'
  | 'A4'
  | 'TT'
  | 'P5'
  | 'd6'
  | 'm6'
  | 'A5'
  | 'M6'
  | 'd7'
  | 'm7'
  | 'A6'
  | 'M7'
  | 'd8'
  | 'P8'
  | 'A7'
  // Theoretical intervals
  | 'A8'
  | 'AA1'
  | 'AA2'
  | 'AA3'
  | 'AA4'
  | 'AA5'
  | 'AA6'
  | 'AA7'
  | 'AA8'
  | 'd1'
  | 'dd1'
  | 'dd2'
  | 'dd3'
  | 'dd4'
  | 'dd5'
  | 'dd6'
  | 'dd7'
  | 'dd8';

const INTERVAL_TO_NOTE_CLASS: Readonly<Record<Interval, NoteClass>> = {
  A7: 0,
  P8: 0,
  P1: 0,
  d2: 0,

  m2: 1,
  A1: 1,
  S: 1,

  M2: 2,
  d3: 2,
  T: 2,

  m3: 3,
  A2: 3,

  M3: 4,
  d4: 4,

  P4: 5,
  A3: 5,

  d5: 6,
  A4: 6,
  TT: 6,

  P5: 7,
  d6: 7,

  m6: 8,
  A5: 8,

  M6: 9,
  d7: 9,

  m7: 10,
  A6: 10,

  M7: 11,
  d8: 11,

  A8: 1,
  AA1: 2,
  AA2: 4,
  AA3: 6,
  AA4: 7,
  AA5: 9,
  AA6: 11,
  AA7: 1,
  AA8: 2,
  d1: 11,
  dd1: 10,
  dd2: 11,
  dd3: 1,
  dd4: 3,
  dd5: 5,
  dd6: 6,
  dd7: 8,
  dd8: 10,
} as const;

export type DegreeWithAccidental =
  `${'bb' | 'b' | '' | '#' | '##'}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

const DEGREE_WITH_ACCIDENTAL_TO_NOTE_CLASS: Readonly<
  Record<DegreeWithAccidental, NoteClass>
> = {
  bb1: 10,
  b1: 11,
  '1': 0,
  '#1': 1,
  '##1': 2,

  bb2: 0,
  b2: 1,
  '2': 2,
  '#2': 3,
  '##2': 4,

  bb3: 2,
  b3: 3,
  '3': 4,
  '#3': 5,
  '##3': 6,

  bb4: 3,
  b4: 4,
  '4': 5,
  '#4': 6,
  '##4': 7,

  bb5: 5,
  b5: 6,
  '5': 7,
  '#5': 8,
  '##5': 9,

  bb6: 7,
  b6: 8,
  '6': 9,
  '#6': 10,
  '##6': 11,

  bb7: 9,
  b7: 10,
  '7': 11,
  '#7': 0,
  '##7': 1,

  bb8: 10,
  b8: 11,
  '8': 0,
  '#8': 1,
  '##8': 2,
} as const;

export type LooseInterval = Interval | DegreeWithAccidental;

export const LOOSE_INTERVAL_TO_NOTE_CLASS: Readonly<
  Record<LooseInterval, NoteClass>
> = {
  ...INTERVAL_TO_NOTE_CLASS,
  ...DEGREE_WITH_ACCIDENTAL_TO_NOTE_CLASS,
} as const;
