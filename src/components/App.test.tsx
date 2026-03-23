import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

const PNG_CONTENT_TYPE = 'image/png';

const { rasterizeSvgMock } = vi.hoisted(() => ({
  rasterizeSvgMock: vi.fn(),
}));

vi.mock('../lib/image.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/image')>();

  return {
    ...actual,
    rasterizeSvg: rasterizeSvgMock,
  };
});

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
  expect(screen.getByLabelText('Pattern')).toHaveValue('Major scale');
  expect(screen.getByLabelText('Root note')).toHaveValue('C');
  expect(screen.getByLabelText('Start fret')).toHaveValue(0);
  expect(screen.getByLabelText('End fret')).toHaveValue(14);
  expect(screen.getByLabelText('Background')).toBeChecked();
  expect(screen.getByLabelText('Strings')).toBeChecked();
  expect(screen.getByLabelText('Fret lines')).toBeChecked();
  expect(screen.getByLabelText('Fret markers')).toBeChecked();
  expect(screen.getByLabelText('Fret labels')).toBeChecked();
  expect(screen.getByLabelText('String labels')).toBeChecked();
  expect(screen.getByLabelText('Drop shadows')).toBeChecked();
  expect(await screen.findByAltText(/major scale/i)).toBeInTheDocument();

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
    'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-14]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-labels].svg',
  );

  fireEvent.pointerDown(screen.getByLabelText('Pattern'));

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
        'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-14]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-labels]-SD.png',
      href: 'blob:mock-download',
      rel: 'noopener',
    },
    {
      download:
        'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-14]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-labels]-HD.png',
      href: 'blob:mock-download',
      rel: 'noopener',
    },
  ]);

  anchorClick.mockRestore();
  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
  vi.unstubAllGlobals();
});
