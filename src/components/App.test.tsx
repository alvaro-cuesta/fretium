import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from './App';

const PNG_CONTENT_TYPE = 'image/png';

const { rasterizeImageMock } = vi.hoisted(() => ({
  rasterizeImageMock: vi.fn(),
}));

vi.mock('../lib/image.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/image')>();

  return {
    ...actual,
    rasterizeImage: rasterizeImageMock,
  };
});

// Basic test to ensure the app renders without crashing
test('renders core controls with defaults and exposes SVG and PNG downloads in the menu', async () => {
  rasterizeImageMock.mockReset();
  rasterizeImageMock.mockResolvedValue(
    new Blob(['png'], { type: PNG_CONTENT_TYPE }),
  );

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

  expect(
    screen.getByRole('menuitem', { name: 'Download SVG' }),
  ).toHaveAttribute('href', 'blob:mock-fretboard');
  expect(
    screen.getByRole('menuitem', { name: 'Download SVG' }),
  ).toHaveAttribute(
    'download',
    'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-14]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-names].svg',
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

  fireEvent.click(screen.getByRole('menuitem', { name: 'Download PNG' }));

  await waitFor(() => {
    expect(rasterizeImageMock).toHaveBeenCalledTimes(1);
  });

  const [[image, outContentType, scale]] = rasterizeImageMock.mock.calls as [
    [HTMLImageElement, string, number],
  ];

  expect(image).toBeInstanceOf(HTMLImageElement);
  expect(image.alt).toMatch(/major scale/i);
  expect(outContentType).toBe(PNG_CONTENT_TYPE);
  expect(scale).toBe(2);

  await waitFor(() => {
    expect(anchorClick).toHaveBeenCalledTimes(1);
  });

  expect(clickedDownloads).toEqual([
    {
      download:
        'fretium-[guitar-standard-EADGBE]-[major-scale]-[open-strings-frets-0-14]-[root-C]-[labels-note]-[with-fret-labels]-[with-string-names].png',
      href: 'blob:mock-download',
      rel: 'noopener',
    },
  ]);

  anchorClick.mockRestore();
  createObjectUrl.mockRestore();
  revokeObjectUrl.mockRestore();
});
