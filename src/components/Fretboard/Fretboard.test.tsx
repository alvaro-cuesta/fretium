import { render } from '@testing-library/react';
import { getFretboardDescription } from '../../lib/fretboard';
import type { Pattern } from '../../lib/pattern-engine';
import { Fretboard, type FretboardProps } from './Fretboard';

const REQUIRED_PROPS = {
  patternName: 'Major scale',
  instrumentName: 'Guitar',
  tuningName: 'Standard',
  showStringNames: false,
  noteDisplayMode: 'note' as const,
  rootNote: 'C' as const,
};

function getDescription(props: Partial<Omit<FretboardProps, 'ref'>> = {}) {
  return getFretboardDescription({
    pattern: [],
    patternName: 'Major scale',
    instrumentName: 'Guitar',
    tuningName: 'Standard',
    tuning: ['E'],
    startFret: 0,
    endFret: 0,
    ...REQUIRED_PROPS,
    ...props,
  });
}

test('keeps the neck local coordinates anchored at the neck edge for open-string diagrams', () => {
  const definition: Pattern = [{ condition: { note: 'E' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const svg = screen.getByRole('img', {
    name: getDescription({ pattern: definition, tuning: ['E'] }),
  });
  const note = screen.getByText('E');
  const noteGroup = note.closest('g');
  const neckGroup = svg.querySelector('svg > g');
  const clipPath = svg.querySelector('clipPath[id^="neck-clip-"]');
  const neckShape = clipPath?.querySelector('path');
  const stringLine = svg.querySelector('line[stroke-width="3.2"]');

  expect(noteGroup).toBeInTheDocument();
  expect(neckGroup).toBeInTheDocument();
  expect(clipPath).toBeInTheDocument();
  expect(clipPath?.querySelector('rect')).not.toBeInTheDocument();
  expect(neckGroup).toHaveAttribute('transform', 'translate(64, 16)');
  expect(noteGroup).toHaveAttribute('transform', 'translate(-29, 12)');
  expect(stringLine).toHaveAttribute('x1', '0');
  expect(neckShape?.getAttribute('d')?.startsWith('M 0 0')).toBe(true);
});

test('sizes the viewBox from the translated neck bounds and label area', () => {
  const definition: Pattern = [{ condition: { note: 'G' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E']}
      startFret={1}
      endFret={3}
    />,
  );

  const svg = screen.getByRole('img', {
    name: getDescription({
      pattern: definition,
      tuning: ['E'],
      startFret: 1,
      endFret: 3,
    }),
  });

  expect(svg).toHaveAttribute('viewBox', '0 0 251 64');
});

test('adds enough left svg padding to fit a full open-string fret', () => {
  const definition: Pattern = [{ condition: { note: 'E' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const svg = screen.getByRole('img', {
    name: getDescription({ pattern: definition, tuning: ['E'] }),
  });

  expect(svg).toHaveAttribute('viewBox', '0 0 107 64');
});

test('renders string names at the open-string position and expands the left margin', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      showStringNames={true}
      pattern={[]}
      tuning={['E']}
      startFret={1}
      endFret={1}
    />,
  );

  const svg = screen.getByRole('img', {
    name: getDescription({
      pattern: [],
      tuning: ['E'],
      startFret: 1,
      endFret: 1,
      showStringNames: true,
    }),
  });
  const stringName = screen.getByText('E');
  const neckGroup = svg.querySelector('svg > g');

  expect(svg).toHaveAttribute('viewBox', '0 0 171 64');
  expect(neckGroup).toHaveAttribute('transform', 'translate(64, 16)');
  expect(stringName).toHaveAttribute('x', '-29');
  expect(stringName).toHaveAttribute('y', '12');
});

test('paints open-string notes on top of string names', () => {
  const definition: Pattern = [{ condition: { note: 'E' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      showStringNames={true}
      pattern={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const renderedLabels = screen.getAllByText('E');

  expect(renderedLabels).toHaveLength(2);
  expect(renderedLabels[0]?.tagName).toBe('text');
  expect(
    renderedLabels[1]?.closest('g')?.querySelector('circle'),
  ).toBeInTheDocument();
});

test('keeps fret-one diagrams in the neck coordinate system including half the nut width', () => {
  const definition: Pattern = [{ condition: { note: 'F' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E']}
      startFret={1}
      endFret={1}
    />,
  );

  const svg = screen.getByRole('img', {
    name: getDescription({
      pattern: definition,
      tuning: ['E'],
      startFret: 1,
      endFret: 1,
    }),
  });
  const clipPath = svg.querySelector('clipPath[id^="neck-clip-"]');
  const stringLine = svg.querySelector('line[stroke-width="3.2"]');
  const neckShape = clipPath?.querySelector('path');
  const nutLine = svg.querySelector('line[stroke-width="6"]');

  expect(clipPath?.querySelector('rect')).not.toBeInTheDocument();
  expect(stringLine).toHaveAttribute('x1', '0');
  expect(nutLine).toHaveAttribute('x1', '3');
  expect(neckShape?.getAttribute('d')?.startsWith('M 0 0')).toBe(true);
});

test('measures higher-fret diagrams from the left overhang edge', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={[]}
      tuning={['E', 'A']}
      startFret={4}
      endFret={4}
    />,
  );

  const svg = screen.getByRole('img', {
    name: getDescription({
      pattern: [],
      tuning: ['E', 'A'],
      startFret: 4,
      endFret: 4,
    }),
  });
  const neckShape = svg.querySelector('clipPath[id^="neck-clip-"] path');
  const fretLines = Array.from(svg.querySelectorAll('line[stroke-width="2"]'));
  const markers = Array.from(
    svg.querySelectorAll('circle[r="4.5"][fill="rgba(192, 192, 192, 1)"]'),
  );

  expect(neckShape?.getAttribute('d')?.startsWith('M 14 0')).toBe(true);
  expect(fretLines.map((line) => line.getAttribute('x1'))).toEqual([
    '24',
    '88',
  ]);
  expect(markers).toHaveLength(2);
  expect(Number(markers[0]?.getAttribute('cx'))).toBeCloseTo(-8);
  expect(Number(markers[1]?.getAttribute('cx'))).toBeCloseTo(120);
});

test('describes the rendered fretboard in the aria label', () => {
  const screen = render(
    <Fretboard
      pattern={[]}
      patternName="Major scale"
      instrumentName="Guitar"
      tuningName="Standard"
      tuning={['E', 'A', 'D', 'G', 'B', 'E']}
      startFret={3}
      endFret={7}
      showStringNames={true}
      noteDisplayMode="degree"
      rootNote="D"
    />,
  );

  expect(screen.getByRole('img')).toHaveAttribute(
    'aria-label',
    'Fretium diagram for Guitar Standard (E A D G B E), pattern: Major scale pattern, frets: 3 through 7, root note: D, note labels: degrees, string names: shown.',
  );
});

test('explicitly centers note text on the note circle', () => {
  const definition: Pattern = [{ condition: { note: 'E' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const note = screen.getByText('E');

  expect(note).toHaveAttribute('x', '0');
  expect(note).toHaveAttribute('y', '0');
  expect(note).toHaveAttribute('dominant-baseline', 'central');
  expect(note).toHaveAttribute('alignment-baseline', 'central');
});

test('always shows fret labels for the visible start and end frets', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={[]}
      tuning={['E']}
      startFret={1}
      endFret={4}
    />,
  );

  expect(screen.queryByText('1')).toBeInTheDocument();
  expect(screen.queryByText('4')).toBeInTheDocument();
});

test('shows the ending fret label for open-string diagrams', () => {
  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={[]}
      tuning={['E']}
      startFret={0}
      endFret={1}
    />,
  );

  expect(screen.queryByText('1')).toBeInTheDocument();
});

test('supports string and fret DSL selectors', () => {
  const definition: Pattern = [
    { condition: { string: 1, fret: 3 }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E', 'A']}
      startFret={0}
      endFret={5}
    />,
  );

  expect(screen.queryAllByText('C').length).toBe(1);
});

test('supports array and range DSL selectors', () => {
  const definition: Pattern = [
    {
      condition: { string: [1, 2], fret: { gte: 3, lte: 4 } },
      color: 'BLACK',
    },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['E', 'A']}
      startFret={0}
      endFret={5}
    />,
  );

  const renderedNoteTexts = ['G', 'G#', 'C', 'C#'];
  for (const note of renderedNoteTexts) {
    expect(screen.queryByText(note)).toBeInTheDocument();
  }
});

test('supports interval DSL selectors', () => {
  const definition: Pattern = [
    { condition: { interval: 'b3' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['C']}
      startFret={0}
      endFret={3}
    />,
  );

  expect(screen.queryByText('D#')).toBeInTheDocument();
});

test('resolves interval DSL selectors against the provided root note', () => {
  const definition: Pattern = [
    { condition: { interval: 'b3' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['A']}
      startFret={0}
      endFret={3}
      rootNote="A"
    />,
  );

  expect(screen.queryByText('C')).toBeInTheDocument();
});

test('supports natural interval selectors against the provided root note', () => {
  const definition: Pattern = [
    { condition: { interval: '1' }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['A']}
      startFret={0}
      endFret={3}
      rootNote="A"
    />,
  );

  expect(screen.queryByText('A')).toBeInTheDocument();
});

test('shows interval labels when interval display mode is selected', () => {
  const definition: Pattern = [
    { condition: { note: ['A', 'B'] }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
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
  expect(screen.queryByText('A')).not.toBeInTheDocument();
});

test('shows degree labels when degree display mode is selected', () => {
  const definition: Pattern = [
    { condition: { note: ['A', 'B', 'C'] }, color: 'BLACK' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
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
  expect(screen.queryByText('A')).not.toBeInTheDocument();
});

test('shows note names by default', () => {
  const definition: Pattern = [{ condition: { note: 'A' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
      tuning={['A']}
      startFret={0}
      endFret={0}
    />,
  );

  expect(screen.queryByText('A')).toBeInTheDocument();
  expect(screen.queryByText('1')).not.toBeInTheDocument();
});

test('hides note labels when none display mode is selected', () => {
  const definition: Pattern = [{ condition: { note: 'A' }, color: 'BLACK' }];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
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
  expect(screen.container.querySelector('circle')).toBeInTheDocument();
});

test('merges all matching rules with later rules winning per property', () => {
  const definition: Pattern = [
    { condition: { note: 'A' }, color: 'BLACK', opacity: 0.5 },
    { condition: { interval: '1' }, color: 'WHITE' },
  ];

  const screen = render(
    <Fretboard
      {...REQUIRED_PROPS}
      pattern={definition}
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
  expect(circle).toHaveAttribute('fill', '#ffffff');
  // Earlier rule's opacity is preserved since later rule has none
  expect(noteGroup).toHaveAttribute('opacity', '0.5');
});
