import { render, waitFor } from '@testing-library/react';
import * as animationFrameHook from '../hooks/useImperativeAnimationFrame';
import { getFretboardDescription } from '../lib/fretboard';
import type { Pattern } from '../lib/pattern-engine';
import { FretboardImg } from './FretboardImg';
import styles from './FretboardImg.module.scss';

const REQUIRED_PROPS = {
  pattern: [] as Pattern,
  patternName: 'Major scale',
  instrumentName: 'Guitar',
  tuningName: 'Standard',
  startFret: 0,
  endFret: 12,
  showStringNames: false,
  noteDisplayMode: 'note' as const,
  rootNote: 'C' as const,
};

const asCleanup = (value: unknown): (() => void) | undefined => {
  return typeof value === 'function' ? (value as () => void) : undefined;
};

beforeEach(() => {
  vi.spyOn(animationFrameHook, 'useImperativeAnimationFrame').mockReturnValue({
    schedule: (callback) => {
      const cleanup = asCleanup(callback());

      return () => {
        cleanup?.();
      };
    },
    unschedule: () => {
      // no-op
    },
    clear: () => {
      // no-op
    },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

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

  const initialAlt = getFretboardDescription({
    ...REQUIRED_PROPS,
    tuning: ['E', 'A', 'D', 'G'],
  });

  const img = await waitFor(() =>
    document.querySelector<HTMLImageElement>(`img[alt="${initialAlt}"]`),
  );

  expect(img).toBeInTheDocument();

  if (!img) {
    throw new Error('Expected the fretboard image to render.');
  }

  expect(img).toHaveClass(styles.fretboardImg);
  expect(img).toHaveStyle({ '--fretboard-string-scale': String(4 / 6) });

  rerender(
    <FretboardImg
      {...REQUIRED_PROPS}
      tuning={['G', 'D', 'A', 'E', 'G', 'D', 'A', 'E']}
    />,
  );

  await waitFor(() => {
    expect(img).toHaveStyle({ '--fretboard-string-scale': String(8 / 6) });
  });

  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});

test('uses descriptive alt text and a metadata-based svg filename', async () => {
  const createObjectUrl = vi
    .spyOn(URL, 'createObjectURL')
    .mockImplementation((object) => {
      expect(object).toBeInstanceOf(File);
      expect((object as File).name).toBe(
        'fretium-[guitar-standard-EADGBE]-[major-scale]-[frets-3-7]-[root-d]-[labels-degree]-[with-string-names].svg',
      );

      return 'blob:mock-fretboard';
    });
  const revokeObjectUrl = vi
    .spyOn(URL, 'revokeObjectURL')
    .mockImplementation(() => undefined);

  const rendered = render(
    <FretboardImg
      {...REQUIRED_PROPS}
      tuning={['E', 'A', 'D', 'G', 'B', 'E']}
      startFret={3}
      endFret={7}
      showStringNames={true}
      noteDisplayMode="degree"
      rootNote="D"
    />,
  );

  const img = await waitFor(() =>
    rendered.container.querySelector<HTMLImageElement>(
      'img[alt="Fretium diagram for Guitar Standard (E A D G B E), pattern: Major scale pattern, frets: 3 through 7, root note: D, note labels: degrees, string names: shown."]',
    ),
  );

  expect(img).toBeInTheDocument();

  if (!img) {
    throw new Error('Expected the fretboard image to render.');
  }

  expect(img).toHaveAttribute('src', 'blob:mock-fretboard');

  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});
