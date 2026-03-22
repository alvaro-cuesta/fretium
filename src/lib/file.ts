// 0 seems to be enough? Make this larger if there are errors downloading the file due to the URL
// being revoked too early
const DOWNLOAD_OBJECT_URL_REVOKE_DELAY_MS = 0;

export function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.click();

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, DOWNLOAD_OBJECT_URL_REVOKE_DELAY_MS);
}

export const SVG_CONTENT_TYPE = 'image/svg+xml;charset=utf-8';

export const PNG_CONTENT_TYPE = 'image/png';
