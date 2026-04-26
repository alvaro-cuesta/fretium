import { render, waitFor } from '@testing-library/react';
import * as animationFrameHook from '../hooks/useImperativeAnimationFrame';
import { getFretboardDescription } from '../lib/fretboard';
import type { Pattern } from '../lib/pattern-engine';
import { FretboardImg, type ImgChangeEvent } from './FretboardImg';
import styles from './FretboardImg.module.scss';

const EMPTY_PATTERN: Pattern = { rules: [] };

const REQUIRED_PROPS = {
  pattern: EMPTY_PATTERN,
  patternName: 'Major scale',
  instrumentName: 'Guitar',
  tuningName: 'Standard',
  startFret: 0,
  endFret: 12,
  showBackgroundNeck: true,
  showFretLines: true,
  showFretMarkers: true,
  showFretLabels: true,
  showStringLabels: false,
  showDropShadows: true,
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
        'fretium-[guitar-standard-EADGBE]-[major-scale]-[frets-3-7]-[root-D]-[labels-degree]-[with-fret-labels]-[with-string-labels].svg',
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
      showFretLabels={true}
      showStringLabels={true}
      showDropShadows={true}
      noteDisplayMode="degree"
      rootNote="D"
    />,
  );

  const img = await waitFor(() =>
    rendered.container.querySelector<HTMLImageElement>(
      'img[alt="Fretium diagram for Guitar Standard (E A D G B E), pattern: Major scale, frets: 3 through 7, root note: D, note labels: degrees, fret labels: shown, string labels: shown."]',
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

test('reports serialized SVG data with the generated image metadata', async () => {
  const createObjectUrl = vi
    .spyOn(URL, 'createObjectURL')
    .mockReturnValue('blob:mock-fretboard');
  const revokeObjectUrl = vi
    .spyOn(URL, 'revokeObjectURL')
    .mockImplementation(() => undefined);
  const onImgChange = vi.fn<(event: ImgChangeEvent | null) => void>();

  render(
    <FretboardImg
      {...REQUIRED_PROPS}
      tuning={['E', 'A', 'D', 'G', 'B', 'E']}
      onImgChange={onImgChange}
    />,
  );

  await waitFor(() => {
    expect(onImgChange).toHaveBeenCalled();
  });

  const [lastImgChange] = onImgChange.mock.calls.at(-1) ?? [];

  expect(lastImgChange).not.toBeNull();

  if (!lastImgChange) {
    throw new Error('Expected the latest image change event to be defined.');
  }

  expect(lastImgChange.url).toBe('blob:mock-fretboard');
  expect(lastImgChange.filenameBase).toBe(
    'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-12]-[root-C]-[labels-note]-[with-fret-labels]-[no-string-labels]',
  );

  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});
