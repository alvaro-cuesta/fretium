import { render } from '@testing-library/react';
import { Fretboard, type FretboardDefinition } from './Fretboard';

test('renders open-string notes outside the neck clip path', () => {
  const definition: FretboardDefinition = [
    { condition: 'Note = E', color: '#000' },
  ];

  const screen = render(
    <Fretboard
      definition={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });
  const note = screen.getByText('E');
  const noteGroup = note.closest('g');
  const clippedGroup = svg.querySelector('g[clip-path^="url(#neck-clip-"]');

  expect(noteGroup).not.toBeNull();
  expect(clippedGroup).not.toBeNull();
  expect(noteGroup?.getAttribute('transform')).toBe('translate(-31, 0)');
  expect(clippedGroup?.contains(note)).toBe(false);
});

test('balances the top and bottom margins around the rendered fretboard content', () => {
  const definition: FretboardDefinition = [
    { condition: 'Note = G', color: '#000' },
  ];

  const screen = render(
    <Fretboard
      definition={definition}
      tuning={['E']}
      startFret={1}
      endFret={3}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });

  expect(svg.getAttribute('viewBox')).toBe('0 0 249.8 66');
});

test('adds extra left margin when open-string notes are shown', () => {
  const definition: FretboardDefinition = [
    { condition: 'Note = E', color: '#000' },
  ];

  const screen = render(
    <Fretboard
      definition={definition}
      tuning={['E']}
      startFret={0}
      endFret={0}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });

  expect(svg.getAttribute('viewBox')).toBe('0 0 101.8 66');
});

test('extends open strings to the nut edge and keeps the neck flat on the left', () => {
  const definition: FretboardDefinition = [
    { condition: 'Note = E', color: '#000' },
  ];

  const screen = render(
    <Fretboard
      definition={definition}
      tuning={['E']}
      startFret={0}
      endFret={1}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });
  const stringLine = svg.querySelector('line[stroke-width="3.2"]');
  const neckShape = svg.querySelector('path[fill="rgba(120, 78, 43, 0.13)"]');

  expect(stringLine?.getAttribute('x1')).toBe('-3');
  expect(neckShape?.getAttribute('d')?.startsWith('M 0 -12')).toBe(true);
});

test('keeps the neck flat against the nut at fret 1', () => {
  const definition: FretboardDefinition = [
    { condition: 'Note = F', color: '#000' },
  ];

  const screen = render(
    <Fretboard
      definition={definition}
      tuning={['E']}
      startFret={1}
      endFret={1}
    />,
  );

  const svg = screen.getByRole('img', { name: 'Fretboard diagram' });
  const neckShape = svg.querySelector('path[fill="rgba(120, 78, 43, 0.13)"]');
  const stringLine = svg.querySelector('line[stroke-width="3.2"]');

  expect(neckShape?.getAttribute('d')?.startsWith('M 0 -12')).toBe(true);
  expect(stringLine?.getAttribute('x1')).toBe('-3');
});

test('explicitly centers note text on the note circle', () => {
  const definition: FretboardDefinition = [
    { condition: 'Note = E', color: '#000' },
  ];

  const screen = render(
    <Fretboard
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
      definition={[]}
      tuning={['E']}
      startFret={0}
      endFret={1}
    />,
  );

  expect(screen.queryByText('1')).not.toBeNull();
});
