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
