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
  showFretLabels: boolean;
  showStringNames: boolean;
  noteDisplayMode: NoteDisplayMode;
  rootNote: Note;
};

const NOTE_DISPLAY_MODE_LABEL: Record<NoteDisplayMode, string> = {
  note: 'names',
  interval: 'intervals',
  degree: 'degrees',
  none: 'none',
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

export function getFretboardDescription(props: FretboardMetadataProps): string {
  const tuningNotes = props.tuning.join(' ');

  const segments = [
    `for ${props.instrumentName} ${props.tuningName} (${tuningNotes})`,
    `pattern: ${props.patternName}`,
    `frets: ${formatFretRangeForDescription(props.startFret, props.endFret)}`,
    `root note: ${props.rootNote}`,
    `note labels: ${NOTE_DISPLAY_MODE_LABEL[props.noteDisplayMode]}`,
    `fret labels: ${props.showFretLabels ? 'shown' : 'hidden'}`,
    `string names: ${props.showStringNames ? 'shown' : 'hidden'}`,
  ];

  return `Fretium diagram ${segments.join(', ')}.`;
}

export function getFretboardImageFilenameBase(
  props: FretboardMetadataProps,
): string {
  const tuningNotesSlug = props.tuning.join('');

  const segments = [
    `${slugify(props.instrumentName)}-${slugify(props.tuningName)}-${tuningNotesSlug}`,
    slugify(props.patternName),
    formatFretRangeSlug(props.startFret, props.endFret),
    `root-${props.rootNote}`,
    `labels-${props.noteDisplayMode}`,
    props.showFretLabels ? 'with-fret-labels' : 'no-fret-labels',
    props.showStringNames ? 'with-string-names' : 'no-string-names',
  ];

  return `fretium-${segments.map((s) => `[${s}]`).join('-')}`;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
