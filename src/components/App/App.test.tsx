import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { App } from './App';

const PNG_CONTENT_TYPE = 'image/png';

const { rasterizeSvgMock } = vi.hoisted(() => ({
  rasterizeSvgMock: vi.fn(),
}));

vi.mock('../../lib/image.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/image')>();

  return {
    ...actual,
    rasterizeSvg: rasterizeSvgMock,
  };
});

afterEach(() => {
  window.history.replaceState(null, '');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function getFirstPanel() {
  return screen.getByRole('article', { name: 'Fretboard 1' });
}

// Basic test to ensure the app renders without crashing
test('renders core controls with defaults and exposes SVG and PNG downloads in the menu', async () => {
  rasterizeSvgMock.mockReset();
  const rasterizedPngBlob = new Blob(['png'], { type: PNG_CONTENT_TYPE });
  rasterizeSvgMock.mockResolvedValue(rasterizedPngBlob);

  class MockClipboardItem {
    readonly items: Record<string, string | Blob | PromiseLike<string | Blob>>;

    constructor(
      items: Record<string, string | Blob | PromiseLike<string | Blob>>,
    ) {
      this.items = items;
    }
  }

  vi.stubGlobal('ClipboardItem', MockClipboardItem);
  const clipboardWrite = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      write: clipboardWrite,
    },
  });

  const createObjectUrl = vi
    .spyOn(URL, 'createObjectURL')
    .mockImplementation((object) => {
      if (object instanceof File) {
        return 'blob:mock-fretboard';
      }

      return 'blob:mock-download';
    });
  const revokeObjectUrl = vi
    .spyOn(URL, 'revokeObjectURL')
    .mockImplementation(() => undefined);
  const clickedDownloads: {
    download: string;
    href: string;
    rel: string;
  }[] = [];
  const anchorClick = vi
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(function (this: HTMLAnchorElement) {
      clickedDownloads.push({
        download: this.download,
        href: this.href,
        rel: this.rel,
      });
    });

  render(<App />);

  expect(screen.getByText(/Fretium/)).toBeInTheDocument();
  expect(screen.getByLabelText('Instrument')).toHaveValue('Guitar::Standard');
  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveValue(
    'heptatonic',
  );
  expect(screen.getByLabelText('Heptatonic Variant')).toHaveValue('major');
  expect(screen.getByLabelText('Major Variant')).toHaveValue('full');
  expect(screen.getByLabelText('Root note')).toHaveValue('C');
  expect(screen.getByLabelText('Start fret')).toHaveValue('AUTO');
  expect(screen.getByLabelText('End fret')).toHaveValue('AUTO');
  expect(screen.getByLabelText('Background')).toBeChecked();
  expect(screen.getByLabelText('Fret lines')).toBeChecked();
  expect(screen.getByLabelText('Fret markers')).toBeChecked();
  expect(screen.getByLabelText('Fret labels')).toBeChecked();
  expect(screen.getByLabelText('String labels')).toBeChecked();
  expect(screen.getByLabelText('Drop shadows')).toBeChecked();
  expect(await screen.findByAltText(/major/i)).toBeInTheDocument();

  const downloadToggle = await screen.findByRole('button', {
    name: 'Download options',
  });
  expect(downloadToggle).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(downloadToggle);

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'true');
  });

  expect(screen.getByRole('menuitem', { name: 'Download' })).toHaveAttribute(
    'href',
    'blob:mock-fretboard',
  );
  expect(screen.getByRole('menuitem', { name: 'Download' })).toHaveAttribute(
    'download',
    'fretium-[guitar-standard-EADGBE]-[heptatonic-major-full]-[open-strings-frets-0-12]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-labels].svg',
  );

  fireEvent.pointerDown(screen.getByRole('combobox', { name: 'Pattern' }));

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'false');
  });

  fireEvent.click(downloadToggle);

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'true');
  });

  fireEvent.keyDown(document, { key: 'Escape' });

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'false');
  });

  fireEvent.click(downloadToggle);

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'true');
  });

  fireEvent.click(screen.getByRole('menuitem', { name: 'Download (SD)' }));

  await waitFor(() => {
    expect(rasterizeSvgMock).toHaveBeenCalledTimes(1);
  });

  const [[sdSvgUrl, sdOutContentType, sdWidth, sdHeight]] = rasterizeSvgMock
    .mock.calls as [[string, string, number, number]];

  expect(sdSvgUrl).toBe('blob:mock-fretboard');
  expect(sdOutContentType).toBe(PNG_CONTENT_TYPE);
  expect(sdWidth).toBeGreaterThan(0);
  expect(sdHeight).toBeGreaterThan(0);

  fireEvent.click(downloadToggle);

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'true');
  });

  fireEvent.click(screen.getByRole('menuitem', { name: 'Download (HD)' }));

  await waitFor(() => {
    expect(rasterizeSvgMock).toHaveBeenCalledTimes(2);
  });

  const [, [hdSvgUrl, hdOutContentType, hdWidth, hdHeight]] = rasterizeSvgMock
    .mock.calls as [
    [string, string, number, number],
    [string, string, number, number],
  ];

  expect(hdSvgUrl).toBe('blob:mock-fretboard');
  expect(hdOutContentType).toBe(PNG_CONTENT_TYPE);
  expect(hdWidth).toBe(sdWidth * 2);
  expect(hdHeight).toBe(sdHeight * 2);

  fireEvent.click(downloadToggle);

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'true');
  });

  fireEvent.click(
    screen.getByRole('menuitem', { name: 'Copy to clipboard (SD)' }),
  );

  await waitFor(() => {
    expect(rasterizeSvgMock).toHaveBeenCalledTimes(3);
    expect(clipboardWrite).toHaveBeenCalledTimes(1);
  });

  fireEvent.click(downloadToggle);

  await waitFor(() => {
    expect(downloadToggle).toHaveAttribute('aria-expanded', 'true');
  });

  fireEvent.click(
    screen.getByRole('menuitem', { name: 'Copy to clipboard (HD)' }),
  );

  await waitFor(() => {
    expect(rasterizeSvgMock).toHaveBeenCalledTimes(4);
    expect(clipboardWrite).toHaveBeenCalledTimes(2);
  });

  const [
    ,
    ,
    [copySdSvgUrl, copySdOutContentType, copySdWidth, copySdHeight],
    [copyHdSvgUrl, copyHdOutContentType, copyHdWidth, copyHdHeight],
  ] = rasterizeSvgMock.mock.calls as [
    [string, string, number, number],
    [string, string, number, number],
    [string, string, number, number],
    [string, string, number, number],
  ];

  expect(copySdSvgUrl).toBe('blob:mock-fretboard');
  expect(copySdOutContentType).toBe(PNG_CONTENT_TYPE);
  expect(copySdWidth).toBe(sdWidth);
  expect(copySdHeight).toBe(sdHeight);

  expect(copyHdSvgUrl).toBe('blob:mock-fretboard');
  expect(copyHdOutContentType).toBe(PNG_CONTENT_TYPE);
  expect(copyHdWidth).toBe(hdWidth);
  expect(copyHdHeight).toBe(hdHeight);

  const clipboardWriteCalls = clipboardWrite.mock.calls as [
    [unknown[]],
    [unknown[]],
  ];
  expect(clipboardWriteCalls[0]).toHaveLength(1);
  expect(clipboardWriteCalls[1]).toHaveLength(1);

  const [copySdItem] = clipboardWriteCalls[0][0] as [MockClipboardItem];
  const [copyHdItem] = clipboardWriteCalls[1][0] as [MockClipboardItem];

  expect(copySdItem).toBeInstanceOf(MockClipboardItem);
  expect(copyHdItem).toBeInstanceOf(MockClipboardItem);
  expect(copySdItem.items[PNG_CONTENT_TYPE]).toBe(rasterizedPngBlob);
  expect(copyHdItem.items[PNG_CONTENT_TYPE]).toBe(rasterizedPngBlob);

  await waitFor(() => {
    expect(anchorClick).toHaveBeenCalledTimes(2);
  });

  expect(clickedDownloads).toEqual([
    {
      download:
        'fretium-[guitar-standard-EADGBE]-[heptatonic-major-full]-[open-strings-frets-0-12]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-labels]-SD.png',
      href: 'blob:mock-download',
      rel: 'noopener',
    },
    {
      download:
        'fretium-[guitar-standard-EADGBE]-[heptatonic-major-full]-[open-strings-frets-0-12]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-labels]-HD.png',
      href: 'blob:mock-download',
      rel: 'noopener',
    },
  ]);

  anchorClick.mockRestore();
  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});

test('loads form controls from history.state and persists updates with replaceState', async () => {
  window.history.replaceState(
    {
      fretium: {
        commonConfig: {
          instrumentTuning: 'Bass::Standard',
          noteDisplayMode: 'interval',
          showBackgroundNeck: false,
          showFretLines: false,
          showFretMarkers: false,
          showFretLabels: false,
          showStringLabels: false,
          showDropShadows: false,
        },
        fretboards: [
          {
            pattern: ['heptatonic', 'minor'],
            rootNote: 'A',
            fretRange: { start: 3, end: 7 },
          },
        ],
      },
    },
    '',
  );

  const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

  render(<App />);

  expect(screen.getByLabelText('Instrument')).toHaveValue('Bass::Standard');
  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveValue(
    'heptatonic',
  );
  expect(screen.getByLabelText('Heptatonic Variant')).toHaveValue('minor');
  expect(screen.getByLabelText('Root note')).toHaveValue('A');
  expect(screen.getByLabelText('Note labels')).toHaveValue('interval');
  expect(screen.getByLabelText('Start fret')).toHaveValue('3');
  expect(screen.getByLabelText('End fret')).toHaveValue('7');
  expect(screen.getByLabelText('Background')).not.toBeChecked();
  expect(screen.getByLabelText('Fret lines')).not.toBeChecked();
  expect(screen.getByLabelText('Fret markers')).not.toBeChecked();
  expect(screen.getByLabelText('Fret labels')).not.toBeChecked();
  expect(screen.getByLabelText('String labels')).not.toBeChecked();
  expect(screen.getByLabelText('Drop shadows')).not.toBeChecked();

  fireEvent.change(screen.getByLabelText('Root note'), {
    target: {
      value: 'G',
    },
  });

  await waitFor(() => {
    const historyState = window.history.state as Record<string, unknown> | null;
    const persisted = historyState?.['fretium'] as
      | { fretboards?: { rootNote: string }[] }
      | undefined;

    expect(persisted?.fretboards?.[0]?.rootNote).toBe('G');
  });

  expect(replaceStateSpy).toHaveBeenCalled();
});

test('clicking the pattern legend focuses the first pattern select', () => {
  render(<App />);

  fireEvent.click(screen.getByText('Pattern'));

  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveFocus();
});

test('shows a third pattern select for arpeggios', () => {
  render(<App />);

  expect(screen.getByRole('group', { name: 'Pattern' })).toBeInTheDocument();

  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern' }), {
    target: {
      value: 'arpeggios/maj7',
    },
  });

  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveValue(
    'arpeggios/maj7',
  );
  expect(screen.getByLabelText('Maj7 Arpeggio Variant')).toHaveValue('full');
  fireEvent.change(screen.getByLabelText('Maj7 Arpeggio Variant'), {
    target: {
      value: 'caged-positions/e',
    },
  });

  expect(screen.getByLabelText('Maj7 Arpeggio Variant')).toHaveValue(
    'caged-positions/e',
  );
  expect(screen.getByLabelText('E position Variant')).toHaveValue('base');
  expect(
    screen.getByRole('option', { name: '+ 6-4-3-2 (root)' }),
  ).toBeInTheDocument();
});

test('shows a third pattern select for tetrads', () => {
  render(<App />);

  fireEvent.change(screen.getByRole('combobox', { name: 'Pattern' }), {
    target: {
      value: 'chords-tetrads/maj7',
    },
  });

  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveValue(
    'chords-tetrads/maj7',
  );
  expect(screen.getByLabelText('Maj7 Tetrad Variant')).toHaveValue(
    'drop3/_6432',
  );
  expect(
    screen.getByLabelText('Drop 3 (Bass 6th) | 6-4-3-2 Variant'),
  ).toHaveValue('all');
  expect(
    screen.getByRole('option', {
      name: 'Root',
    }),
  ).toBeInTheDocument();
});

test('restores nested pattern paths from history.state arrays', () => {
  window.history.replaceState(
    {
      fretium: {
        commonConfig: {
          instrumentTuning: 'Guitar::Standard',
          noteDisplayMode: 'note',
          showBackgroundNeck: true,
          showFretLines: true,
          showFretMarkers: true,
          showFretLabels: true,
          showStringLabels: true,
          showDropShadows: true,
        },
        fretboards: [
          {
            pattern: ['arpeggios/dom7', 'caged-positions/d', 'base'],
            rootNote: 'C',
            fretRange: { start: 'AUTO', end: 'AUTO' },
          },
        ],
      },
    },
    '',
  );

  render(<App />);

  expect(screen.getByRole('group', { name: 'Pattern' })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveValue(
    'arpeggios/dom7',
  );
  expect(screen.getByLabelText('7 Arpeggio Variant')).toHaveValue(
    'caged-positions/d',
  );
  expect(screen.getByLabelText('D position Variant')).toHaveValue('base');
});

test('keeps focus on the same pattern select when its value changes', () => {
  render(<App />);

  const patternSelect = screen.getByRole('combobox', { name: 'Pattern' });

  patternSelect.focus();
  expect(patternSelect).toHaveFocus();

  fireEvent.change(patternSelect, {
    target: {
      value: 'arpeggios/maj7',
    },
  });

  expect(screen.getByRole('combobox', { name: 'Pattern' })).toHaveFocus();
});

// ----- Multiple fretboards -----

test('starts with one panel and renders no reorder / delete controls', () => {
  render(<App />);

  expect(screen.getAllByRole('article')).toHaveLength(1);
  const firstPanel = getFirstPanel();
  expect(
    within(firstPanel).queryByRole('button', { name: 'Drag to reorder' }),
  ).toBeNull();
  expect(
    within(firstPanel).queryByRole('button', { name: 'Move fretboard up' }),
  ).toBeNull();
  expect(
    within(firstPanel).queryByRole('button', { name: 'Move fretboard down' }),
  ).toBeNull();
  expect(
    within(firstPanel).queryByRole('button', { name: 'Delete fretboard' }),
  ).toBeNull();
});

test('insert-copy-below appends a copy of the panel below it', () => {
  render(<App />);

  const firstPanel = getFirstPanel();
  // Change the root note so we can verify the copy carries it over
  fireEvent.change(within(firstPanel).getByLabelText('Root note'), {
    target: { value: 'F' },
  });

  fireEvent.click(
    within(firstPanel).getByRole('button', {
      name: 'Insert a copy of this fretboard below',
    }),
  );

  const panels = screen.getAllByRole('article');
  expect(panels).toHaveLength(2);
  const secondPanel = screen.getByRole('article', { name: 'Fretboard 2' });
  expect(within(secondPanel).getByLabelText('Root note')).toHaveValue('F');
});

test('insert-copy-above prepends a copy with the same config', () => {
  render(<App />);

  const firstPanel = getFirstPanel();
  fireEvent.change(within(firstPanel).getByLabelText('Root note'), {
    target: { value: 'G' },
  });

  fireEvent.click(
    within(firstPanel).getByRole('button', {
      name: 'Insert a copy of this fretboard above',
    }),
  );

  expect(screen.getAllByRole('article')).toHaveLength(2);
  // The new panel is now Fretboard 1 and the old one slid down to Fretboard 2.
  expect(within(getFirstPanel()).getByLabelText('Root note')).toHaveValue('G');
  expect(
    within(screen.getByRole('article', { name: 'Fretboard 2' })).getByLabelText(
      'Root note',
    ),
  ).toHaveValue('G');
});

test('inserted copies are independent (deep clone)', () => {
  render(<App />);

  fireEvent.click(
    within(getFirstPanel()).getByRole('button', {
      name: 'Insert a copy of this fretboard below',
    }),
  );

  fireEvent.change(within(getFirstPanel()).getByLabelText('Root note'), {
    target: { value: 'D' },
  });

  expect(within(getFirstPanel()).getByLabelText('Root note')).toHaveValue('D');
  expect(
    within(screen.getByRole('article', { name: 'Fretboard 2' })).getByLabelText(
      'Root note',
    ),
  ).toHaveValue('C');
});

test('arrows reorder adjacent panels and wrap around at the ends', () => {
  render(<App />);

  // Add a second panel, then a third (so wrap-around is observable)
  fireEvent.click(
    within(getFirstPanel()).getByRole('button', {
      name: 'Insert a copy of this fretboard below',
    }),
  );
  fireEvent.click(
    within(getFirstPanel()).getByRole('button', {
      name: 'Insert a copy of this fretboard below',
    }),
  );

  // Differentiate the three panels by root note
  fireEvent.change(within(getFirstPanel()).getByLabelText('Root note'), {
    target: { value: 'E' },
  });
  fireEvent.change(
    within(screen.getByRole('article', { name: 'Fretboard 2' })).getByLabelText(
      'Root note',
    ),
    { target: { value: 'A' } },
  );
  fireEvent.change(
    within(screen.getByRole('article', { name: 'Fretboard 3' })).getByLabelText(
      'Root note',
    ),
    { target: { value: 'G' } },
  );

  // Move first (E) down: order should become A, E, G
  fireEvent.click(
    within(getFirstPanel()).getByRole('button', {
      name: 'Move fretboard down',
    }),
  );
  expect(within(getFirstPanel()).getByLabelText('Root note')).toHaveValue('A');
  expect(
    within(screen.getByRole('article', { name: 'Fretboard 2' })).getByLabelText(
      'Root note',
    ),
  ).toHaveValue('E');

  // Move first (now A) up: wraps to the end → order becomes E, G, A
  fireEvent.click(
    within(getFirstPanel()).getByRole('button', { name: 'Move fretboard up' }),
  );
  expect(within(getFirstPanel()).getByLabelText('Root note')).toHaveValue('E');
  expect(
    within(screen.getByRole('article', { name: 'Fretboard 3' })).getByLabelText(
      'Root note',
    ),
  ).toHaveValue('A');

  // Move last (A) down: wraps to the start → order becomes A, E, G
  fireEvent.click(
    within(screen.getByRole('article', { name: 'Fretboard 3' })).getByRole(
      'button',
      { name: 'Move fretboard down' },
    ),
  );
  expect(within(getFirstPanel()).getByLabelText('Root note')).toHaveValue('A');
  expect(
    within(screen.getByRole('article', { name: 'Fretboard 2' })).getByLabelText(
      'Root note',
    ),
  ).toHaveValue('E');
  expect(
    within(screen.getByRole('article', { name: 'Fretboard 3' })).getByLabelText(
      'Root note',
    ),
  ).toHaveValue('G');
});

test('delete shows confirmation; confirm removes panel; cancel keeps it', async () => {
  render(<App />);

  fireEvent.click(
    within(getFirstPanel()).getByRole('button', {
      name: 'Insert a copy of this fretboard below',
    }),
  );

  expect(screen.getAllByRole('article')).toHaveLength(2);

  // Cancel path — each panel has a delete button on both its above and below bars
  const [firstCancelDelete] = within(getFirstPanel()).getAllByRole('button', {
    name: 'Delete fretboard',
  });
  if (!firstCancelDelete) throw new Error('Expected a delete button');
  fireEvent.click(firstCancelDelete);
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.getAllByRole('article')).toHaveLength(2);

  // Confirm path
  const [firstConfirmDelete] = within(getFirstPanel()).getAllByRole('button', {
    name: 'Delete fretboard',
  });
  if (!firstConfirmDelete) throw new Error('Expected a delete button');
  fireEvent.click(firstConfirmDelete);
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await waitFor(() => {
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
