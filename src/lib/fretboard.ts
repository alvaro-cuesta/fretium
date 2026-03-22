import type { Tuning } from './instrument';
import type { Note } from './music';
import type { Pattern } from './pattern-engine';

export type NoteDisplayMode = 'note' | 'interval' | 'degree' | 'none';

type FretboardMetadataProps = {
  pattern: Pattern;
  patternName: string;
  instrumentName: string;
  tuningName: string;
  tuning: Tuning<number>;
  startFret: number;
  endFret: number;
  showStringNames: boolean;
  noteDisplayMode: NoteDisplayMode;
  rootNote: Note;
};

const NOTE_DISPLAY_MODE_LABEL: Record<NoteDisplayMode, string> = {
  note: 'names',
  interval: 'intervals',
  degree: 'degrees',
  none: 'nonde',
};

type FretboardDerivedMetadata = {
  patternNameLabel: string;
  patternNameSlug: string;
  instrumentLabel: string;
  instrumentSlug: string;
  tuningLabel: string;
  tuningSlug: string;
  tuningNotes: Note[];
  fretRangeLabel: string;
  fretRangeSlug: string;
  rootNoteLabel: Note;
  rootNoteSlug: string;
  noteDisplayLabel: string;
  noteDisplaySlug: NoteDisplayMode;
  stringNamesLabel: string;
  stringNamesSlug: 'with-string-names' | 'no-string-names';
};

function formatFretRangeSlug(startFret: number, endFret: number): string {
  if (startFret === 0 && endFret === 0) {
    return 'open-strings';
  }

  if (startFret === 0) {
    return `open-strings-frets-0-${endFret}`;
  }

  return `frets-${startFret}-${endFret}`;
}

function formatFretRangeForDescription(
  startFret: number,
  endFret: number,
): string {
  if (startFret === 0 && endFret === 0) {
    return 'open strings';
  }

  if (startFret === 0) {
    return `open strings through fret ${endFret}`;
  }

  if (startFret === endFret) {
    return `${startFret}`;
  }

  return `${startFret} through ${endFret}`;
}

function noteToSlug(note: Note): string {
  const baseNote = note.charAt(0).toLowerCase();
  const accidental = note.slice(1);

  if (accidental === '#') {
    return `${baseNote}-sharp`;
  }

  if (accidental === 'b') {
    return `${baseNote}-flat`;
  }

  return baseNote;
}

function getFretboardDerivedMetadata({
  patternName,
  instrumentName,
  tuningName,
  tuning,
  startFret,
  endFret,
  showStringNames,
  noteDisplayMode,
  rootNote,
}: FretboardMetadataProps): FretboardDerivedMetadata {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  return {
    patternNameLabel: patternName,
    patternNameSlug: slugify(patternName),
    instrumentLabel: instrumentName,
    instrumentSlug: slugify(instrumentName),
    tuningLabel: tuningName,
    tuningSlug: slugify(tuningName),
    tuningNotes: tuning,
    fretRangeLabel: formatFretRangeForDescription(startFret, endFret),
    fretRangeSlug: formatFretRangeSlug(startFret, endFret),
    rootNoteLabel: rootNote,
    rootNoteSlug: `root-${noteToSlug(rootNote)}`,
    noteDisplayLabel: NOTE_DISPLAY_MODE_LABEL[noteDisplayMode],
    noteDisplaySlug: noteDisplayMode,
    stringNamesLabel: showStringNames ? 'shown' : 'hidden',
    stringNamesSlug: showStringNames ? 'with-string-names' : 'no-string-names',
  };
}

export function getFretboardDescription(props: FretboardMetadataProps): string {
  const metadata = getFretboardDerivedMetadata(props);
  const tuningNotes = metadata.tuningNotes.join(' ');

  return `Fretium diagram for ${metadata.instrumentLabel} ${metadata.tuningLabel} (${tuningNotes}), pattern: ${metadata.patternNameLabel} pattern, frets: ${metadata.fretRangeLabel}, root note: ${metadata.rootNoteLabel}, note labels: ${metadata.noteDisplayLabel}, string names: ${metadata.stringNamesLabel}.`;
}

export function getFretboardImageFilename(
  props: FretboardMetadataProps,
): string {
  const metadata = getFretboardDerivedMetadata(props);
  const tuningNotesSlug = metadata.tuningNotes.join('');
  const instrumentTuningSlug = `${metadata.instrumentSlug}-${metadata.tuningSlug}-${tuningNotesSlug}`;

  const segments = [
    instrumentTuningSlug,
    metadata.patternNameSlug,
    metadata.fretRangeSlug,
    metadata.rootNoteSlug,
    `labels-${metadata.noteDisplaySlug}`,
    metadata.stringNamesSlug,
  ];

  return `fretium-${segments.map((s) => `[${s}]`).join('-')}.svg`;
}
