import {
  getFretboardDescription,
  getFretboardImageFilenameBase,
} from './fretboard';
import type { Note } from './music';
import type { Pattern } from './pattern-engine';

const EMPTY_PATTERN: Pattern = { rules: [] };

const PROPS_BASE = {
  pattern: EMPTY_PATTERN,
  patternName: 'Major scale',
  instrumentName: 'Guitar',
  tuningName: 'Standard',
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'] as Note[],
  showFretLabels: true,
  showStringLabels: false,
  showDropShadows: true,
  noteDisplayMode: 'note' as const,
  rootNote: 'C' as const,
};

describe('getFretboardDescription', () => {
  test('describes open strings (fret 0-0)', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
    });

    expect(description).toContain('open strings');
    expect(description).not.toContain('fret 0');
  });

  test('describes open strings through a fret', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 12,
    });

    expect(description).toContain('open strings through fret 12');
  });

  test('describes a single fret (not open strings)', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 5,
      endFret: 5,
    });

    expect(description).toContain('frets: 5');
  });

  test('describes multiple frets', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 3,
      endFret: 7,
    });

    expect(description).toContain('frets: 3 through 7');
  });

  test('includes pattern name', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
    });

    expect(description).toContain('Major scale');
  });

  test('includes tuning', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
    });

    expect(description).toContain('Standard');
  });

  test('includes root note', () => {
    const description = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      rootNote: 'D',
    });

    expect(description).toContain('root note: D');
  });

  test('includes note display label', () => {
    const descriptionNote = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      noteDisplayMode: 'note',
    });
    expect(descriptionNote).toContain('note labels: names');

    const descriptionInterval = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      noteDisplayMode: 'interval',
    });
    expect(descriptionInterval).toContain('note labels: intervals');

    const descriptionDegree = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      noteDisplayMode: 'degree',
    });
    expect(descriptionDegree).toContain('note labels: degrees');

    const descriptionNone = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      noteDisplayMode: 'none',
    });
    expect(descriptionNone).toContain('note labels: none');
  });

  test('includes string labels label', () => {
    const withStringLabels = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      showStringLabels: true,
    });
    expect(withStringLabels).toContain('string labels: shown');

    const withoutStringLabels = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      showStringLabels: false,
    });
    expect(withoutStringLabels).toContain('string labels: hidden');
  });

  test('includes fret labels label', () => {
    const withAll = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      showFretLabels: true,
    });
    expect(withAll).toContain('fret labels: shown');

    const withoutFretLabels = getFretboardDescription({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      showFretLabels: false,
    });
    expect(withoutFretLabels).toContain('fret labels: hidden');
  });
});

describe('getFretboardImageFilename', () => {
  test('uses open-strings slug for fret 0-0', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
    });

    expect(filename).toContain('[open-strings]');
    expect(filename).not.toContain('[frets-0-0]');
  });

  test('uses open-strings-frets-0-X slug for open strings through fret X', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 12,
    });

    expect(filename).toContain('[open-strings-frets-0-12]');
  });

  test('uses frets-X-Y slug for multiple frets', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 3,
      endFret: 7,
    });

    expect(filename).toContain('[frets-3-7]');
  });

  test('has correct format with all segments', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 12,
      showStringLabels: true,
      noteDisplayMode: 'degree',
      rootNote: 'D',
    });

    expect(filename).toMatch(
      /fretium-\[.*\]-\[.*\]-\[.*\]-\[.*\]-\[.*\]-\[.*\]-\[.*\]/,
    );
    expect(filename).toContain('[guitar-standard-EADGBE]');
    expect(filename).toContain('[major-scale]');
    expect(filename).toContain('[open-strings-frets-0-12]');
    expect(filename).toContain('[root-D]');
    expect(filename).toContain('[labels-degree]');
    expect(filename).toContain('[with-fret-labels]');
    expect(filename).toContain('[with-string-labels]');
  });

  test('ends with .svg', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
    });

    expect(filename).not.toMatch(/\.svg$/);
  });

  test('converts pattern name to lowercase slug', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      patternName: 'Major Scale',
      startFret: 0,
      endFret: 0,
    });

    expect(filename).toContain('[major-scale]');
  });

  test('handles accidentals in root note slug', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      rootNote: 'C#',
    });

    expect(filename).toContain('[root-C#]');
  });

  test('handles flat accidentals in root note slug', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      rootNote: 'Db',
    });

    expect(filename).toContain('[root-Db]');
  });

  test('includes hidden-state slug for fret labels', () => {
    const filename = getFretboardImageFilenameBase({
      ...PROPS_BASE,
      startFret: 0,
      endFret: 0,
      showFretLabels: false,
    });

    expect(filename).toContain('[no-fret-labels]');
  });
});
