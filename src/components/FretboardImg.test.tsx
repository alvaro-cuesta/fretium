import { render, waitFor } from '@testing-library/react';
import type { RuleDefinition } from '../lib/rule-engine.ts';
import styles from './FretboardImg.module.scss';
import { FretboardImg } from './FretboardImg.tsx';

const REQUIRED_PROPS = {
  definition: [] as RuleDefinition,
  startFret: 0,
  endFret: 12,
  noteDisplayMode: 'note' as const,
  rootNote: 'C' as const,
};

test('scales the rendered image height with the tuning string count', async () => {
  const createObjectUrl = vi
    .spyOn(URL, 'createObjectURL')
    .mockReturnValue('blob:mock-fretboard');
  const revokeObjectUrl = vi
    .spyOn(URL, 'revokeObjectURL')
    .mockImplementation(() => undefined);

  const { rerender } = render(
    <FretboardImg
      {...REQUIRED_PROPS}
      tuning={['E', 'A', 'D', 'G']}
    />,
  );

  const img = await waitFor(() =>
    document.querySelector<HTMLImageElement>('img[alt="Fretboard diagram"]'),
  );

  expect(img).not.toBeNull();

  if (!img) {
    throw new Error('Expected the fretboard image to render.');
  }

  expect(img.classList.contains(styles.fretboardImg)).toBe(true);
  expect(img.style.getPropertyValue('--fretboard-string-scale')).toBe(
    String(4 / 6),
  );

  rerender(
    <FretboardImg
      {...REQUIRED_PROPS}
      tuning={['G', 'D', 'A', 'E', 'G', 'D', 'A', 'E']}
    />,
  );

  await waitFor(() => {
    expect(img.style.getPropertyValue('--fretboard-string-scale')).toBe(
      String(8 / 6),
    );
  });

  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});
