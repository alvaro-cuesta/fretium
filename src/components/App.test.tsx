import { render, screen } from '@testing-library/react';
import { App } from './App';

// Basic test to ensure the app renders without crashing
test('renders core controls with defaults and shows the default fretboard image', async () => {
  const createObjectUrl = vi
    .spyOn(URL, 'createObjectURL')
    .mockReturnValue('blob:mock-fretboard');
  const revokeObjectUrl = vi
    .spyOn(URL, 'revokeObjectURL')
    .mockImplementation(() => undefined);

  render(<App />);

  expect(screen.getByText(/Fretium/)).toBeInTheDocument();
  expect(screen.getByLabelText('Instrument')).toHaveValue('Guitar::Standard');
  expect(screen.getByLabelText('Pattern')).toHaveValue('Major scale');
  expect(screen.getByLabelText('Root note')).toHaveValue('C');
  expect(screen.getByLabelText('Start fret')).toHaveValue(0);
  expect(screen.getByLabelText('End fret')).toHaveValue(14);
  expect(
    await screen.findByAltText(/major scale pattern/i),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('link', { name: 'Download SVG' }),
  ).toHaveAttribute('href', 'blob:mock-fretboard');
  expect(screen.getByRole('link', { name: 'Download SVG' })).toHaveAttribute(
    'download',
    'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-14]-[root-c]-[labels-note]-[with-string-names].svg',
  );

  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});
