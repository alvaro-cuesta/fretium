import { render } from '@testing-library/react';
import type { RuleDefinition } from '../../lib/rule-engine';
import { Fretboard } from './Fretboard';

const REQUIRED_PROPS = {
  noteDisplayMode: 'note' as const,
  rootNote: 'C' as const,
};

test('keeps the neck local coordinates anchored at the neck edge for open-string diagrams', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'E' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });
  const note = screen.getByText('E');
  const noteGroup = note.closest('g');
  const neckGroup = svg.querySelector('svg > g');
  const clipPath = svg.querySelector('clipPath[id^="neck-clip-"]');
  const neckShape = svg.querySelector('path[fill="rgba(120, 78, 43, 0.13)"]');
  const stringLine = svg.querySelector('line[stroke-width="3.2"]');

  expect(noteGroup).not.toBeNull();
  expect(neckGroup).not.toBeNull();
  expect(clipPath).not.toBeNull();
  expect(clipPath?.querySelector('rect')).toBeNull();
  expect(neckGroup?.getAttribute('transform')).toBe('translate(68, 30)');
  expect(noteGroup?.getAttribute('transform')).toBe('translate(-28, 12)');
  expect(stringLine?.getAttribute('x1')).toBe('0');
  expect(neckShape?.getAttribute('d')?.startsWith('M 0 0')).toBe(true);
});

test('sizes the viewBox from the translated neck bounds and label area', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'G' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E']}
      startFret={1}
      endFret={3}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });

  expect(svg.getAttribute('viewBox')).toBe('0 0 273.8 113');
});

test('adds left svg padding for open notes by translating the neck group', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'E' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });

  expect(svg.getAttribute('viewBox')).toBe('0 0 125.8 84');
});

test('keeps fret-one diagrams in the neck coordinate system including half the nut width', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'F' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E']}
      startFret={1}
      endFret={1}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });
  const clipPath = svg.querySelector('clipPath[id^="neck-clip-"]');
  const stringLine = svg.querySelector('line[stroke-width="3.2"]');
  const neckShape = svg.querySelector('path[fill="rgba(120, 78, 43, 0.13)"]');
  const nutLine = svg.querySelector('line[stroke-width="6"]');

  expect(clipPath?.querySelector('rect')).toBeNull();
  expect(stringLine?.getAttribute('x1')).toBe('0');
  expect(nutLine?.getAttribute('x1')).toBe('3');
  expect(neckShape?.getAttribute('d')?.startsWith('M 0 0')).toBe(true);
});

test('measures higher-fret diagrams from the left overhang edge', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={[]}
      tuning={['E', 'A']}
      startFret={4}
      endFret={4}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });
  const neckShape = svg.querySelector('path[fill="rgba(120, 78, 43, 0.13)"]');
  const fretLines = Array.from(svg.querySelectorAll('line[stroke-width="2"]'));
  const markers = Array.from(
    svg.querySelectorAll('circle[r="4.5"][fill="rgba(192, 192, 192, 1)"]'),
  );

  expect(neckShape?.getAttribute('d')?.startsWith('M 14 0')).toBe(true);
  expect(fretLines.map((line) => line.getAttribute('x1'))).toEqual([
    '24.8',
    '86.8',
  ]);
  expect(markers).toHaveLength(2);
  expect(Number(markers[0]?.getAttribute('cx'))).toBeCloseTo(-6.2);
  expect(Number(markers[1]?.getAttribute('cx'))).toBeCloseTo(117.8);
});

test('explicitly centers note text on the note circle', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'E' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const note = screen.getByText('E');

  expect(note.getAttribute('x')).toBe('0');
  expect(note.getAttribute('y')).toBe('0');
  expect(note.getAttribute('dominant-baseline')).toBe('central');
  expect(note.getAttribute('alignment-baseline')).toBe('central');
});

test('always shows fret labels for the visible start and end frets', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={[]}
      tuning={['E']}
      startFret={1}
      endFret={4}
    />,
  );

  expect(screen.queryByText('1')).not.toBeNull();
  expect(screen.queryByText('4')).not.toBeNull();
});

test('shows the ending fret label for open-string diagrams', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={[]}
      tuning={['E']}
      startFret={0}
      endFret={1}
    />,
  );

  expect(screen.queryByText('1')).not.toBeNull();
});

test('supports string and fret DSL selectors', () => {
  const definition: RuleDefinition = [
    { condition: { string: 1, fret: 3 }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E', 'A']}
      startFret={0}
      endFret={5}
    />,
  );

  expect(screen.queryAllByText('C').length).toBe(1);
});

test('supports array and range DSL selectors', () => {
  const definition: RuleDefinition = [
    {
      condition: { string: [1, 2], fret: { gte: 3, lte: 4 } },
      color: 'BLACK',
    },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['E', 'A']}
      startFret={0}
      endFret={5}
    />,
  );

  const renderedNoteTexts = ['G', 'G#', 'C', 'C#'];
  expect(
    renderedNoteTexts.every((note) => screen.queryByText(note) !== null),
  ).toBe(true);
});

test('supports interval DSL selectors', () => {
  const definition: RuleDefinition = [
    { condition: { interval: 'b3' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['C']}
      startFret={0}
      endFret={3}
    />,
  );

  expect(screen.queryByText('D#')).not.toBeNull();
});

test('resolves interval DSL selectors against the provided root note', () => {
  const definition: RuleDefinition = [
    { condition: { interval: 'b3' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={3}
      rootNote="A"
    />,
  );

  expect(screen.queryByText('C')).not.toBeNull();
});

test('supports natural interval selectors against the provided root note', () => {
  const definition: RuleDefinition = [
    { condition: { interval: '1' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={3}
      rootNote="A"
    />,
  );

  expect(screen.queryByText('A')).not.toBeNull();
});

test('shows interval labels when interval display mode is selected', () => {
  const definition: RuleDefinition = [
    { condition: { note: ['A', 'B'] }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={2}
      rootNote="A"
      noteDisplayMode="interval"
    />,
  );

  const noteLabels = Array.from(
    screen.container.querySelectorAll('text[alignment-baseline="central"]'),
  ).map((node) => node.textContent);

  expect(noteLabels).toContain('P1');
  expect(noteLabels).toContain('M2');
  expect(screen.queryByText('A')).toBeNull();
});

test('shows degree labels when degree display mode is selected', () => {
  const definition: RuleDefinition = [
    { condition: { note: ['A', 'B', 'C'] }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={3}
      rootNote="A"
      noteDisplayMode="degree"
    />,
  );

  const noteLabels = Array.from(
    screen.container.querySelectorAll('text[alignment-baseline="central"]'),
  ).map((node) => node.textContent);

  expect(noteLabels).toContain('1');
  expect(noteLabels).toContain('2');
  expect(noteLabels).toContain('b3');
  expect(screen.queryByText('A')).toBeNull();
});

test('shows note names by default', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'A' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={0}
    />,
  );

  expect(screen.queryByText('A')).not.toBeNull();
  expect(screen.queryByText('1')).toBeNull();
});

test('hides note labels when none display mode is selected', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'A' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={0}
      noteDisplayMode="none"
    />,
  );

  const noteLabels = screen.container.querySelectorAll(
    'text[alignment-baseline="central"]',
  );

  expect(noteLabels.length).toBe(0);
  expect(screen.container.querySelector('circle')).not.toBeNull();
});

test('merges all matching rules with later rules winning per property', () => {
  const definition: RuleDefinition = [
    { condition: { note: 'A' }, color: 'BLACK', opacity: 0.5 },
    { condition: { interval: '1' }, color: 'WHITE' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      definition={definition}
      tuning={['A']}
      startFret={0}
      endFret={0}
      rootNote="A"
    />,
  );

  const note = screen.getByText('A');
  const noteGroup = note.closest('g');
  const circle = noteGroup?.querySelector('circle');

  // Last matching rule wins for color (WHITE = '#ffffff')
  expect(circle?.getAttribute('fill')).toBe('#ffffff');
  // Earlier rule's opacity is preserved since later rule has none
  expect(noteGroup?.getAttribute('opacity')).toBe('0.5');
});
