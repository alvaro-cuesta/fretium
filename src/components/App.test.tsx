import { render, screen } from '@testing-library/react';
import { App } from './App';

// Basic test to ensure the app renders without crashing
test('renders core controls with defaults and shows the default fretboard image', async () => {
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
});
