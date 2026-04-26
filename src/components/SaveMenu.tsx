import cx from 'classnames';
import { useId, useState } from 'react';
import { useImperativeTimeout } from '../hooks/useImperativeTimeout.ts';
import globalStyles from '../index.module.scss';
import { downloadBlob, PNG_CONTENT_TYPE } from '../lib/file';
import { rasterizeSvg } from '../lib/image';
import { MenuButton } from './MenuButton';
import styles from './SaveMenu.module.scss';

const PNG_EXPORT_SCALE_SD = 2 as const;
const PNG_EXPORT_SCALE_HD = 4 as const;
const TOAST_DURATION_MS = 3000;

// Whether the browser supports writing a given content type to the clipboard.
// Evaluated lazily so test mocks that stub ClipboardItem are picked up.
function canCopyToClipboard(contentType: string) {
  if (typeof ClipboardItem === 'undefined') return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- clipboard can be undefined in insecure contexts
  if (typeof navigator.clipboard?.write !== 'function') return false;
  // Firefox exposes ClipboardItem but only supports text types, not images.
  // ClipboardItem.supports() detects this; when unavailable (older browsers
  // that do support the type) we fall through optimistically.
  if (typeof ClipboardItem.supports === 'function') {
    return ClipboardItem.supports(contentType);
  }
  return true;
}

// The SVG_CONTENT_TYPE includes ";charset=utf-8" which ClipboardItem doesn't
// accept — use the base MIME type for clipboard operations.
const SVG_CLIPBOARD_TYPE = 'image/svg+xml';

// Whether the browser supports sharing files of a given content type via the
// Web Share API. Uses navigator.canShare() with a dummy file to probe support.
function canShareFile(contentType: string, extension: string) {
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return false;
  const testFile = new File([], `test.${extension}`, { type: contentType });
  return navigator.canShare({ files: [testFile] });
}

async function downloadSvgAsPng(
  svgUrl: string,
  filenameBase: string,
  width: number,
  height: number,
) {
  const pngBlob = await rasterizeSvg(svgUrl, PNG_CONTENT_TYPE, width, height);
  downloadBlob(pngBlob, `${filenameBase}.png`);
}

// Pass the rasterization Promise directly to ClipboardItem so the
// clipboard.write call happens synchronously within the user gesture —
// if we await the rasterization first, mobile browsers reject the write
// because the gesture has expired by the time we reach clipboard.write.
function copySvgToClipboardPng(svgUrl: string, width: number, height: number) {
  return navigator.clipboard.write([
    new ClipboardItem({
      [PNG_CONTENT_TYPE]: rasterizeSvg(svgUrl, PNG_CONTENT_TYPE, width, height),
    }),
  ]);
}

// @todo Consider using dataUrl here?
// Has drawbacks (too long, might hit limits) but also benefits (no need to revoke object URL, can
// be bookmarked, the URL is not revoked so it survives browser refresh, etc.)
async function openInNewTabSvgAsPng(
  svgUrl: string,
  width: number,
  height: number,
) {
  const pngBlob = await rasterizeSvg(svgUrl, PNG_CONTENT_TYPE, width, height);
  const pngUrl = URL.createObjectURL(pngBlob);
  window.open(pngUrl, '_blank');
  URL.revokeObjectURL(pngUrl);
}

type Toast = { message: string; type: 'success' | 'error' };

type SaveMenuProps = {
  svgUrl: string;
  filenameBase: string;
  width: number;
  height: number;
};

export function SaveMenu(props: SaveMenuProps) {
  const svgMenuGroupLabelId = useId();
  const pngMenuGroupLabelId = useId();
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimeout = useImperativeTimeout();

  function showToast(next: Toast) {
    setToast(next);
    toastTimeout.schedule(() => {
      setToast(null);
    }, TOAST_DURATION_MS);
  }

  async function handleCopySvg() {
    try {
      const blob = await fetch(props.svgUrl).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [SVG_CLIPBOARD_TYPE]: new Blob([blob], { type: SVG_CLIPBOARD_TYPE }),
        }),
      ]);
      showToast({ message: 'Copied!', type: 'success' });
    } catch (error) {
      console.error('SVG clipboard copy failed:', error);
      showToast({ message: 'Failed to copy', type: 'error' });
    }
  }

  async function handleShareSvg() {
    try {
      const blob = await fetch(props.svgUrl).then((r) => r.blob());
      const file = new File([blob], `${props.filenameBase}.svg`, {
        type: SVG_CLIPBOARD_TYPE,
      });
      await navigator.share({ files: [file] });
    } catch (error) {
      // User cancelling the share sheet throws AbortError — don't toast that.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('SVG share failed:', error);
      showToast({ message: 'Failed to share', type: 'error' });
    }
  }

  async function handleSharePng(width: number, height: number, suffix: string) {
    try {
      const pngBlob = await rasterizeSvg(
        props.svgUrl,
        PNG_CONTENT_TYPE,
        width,
        height,
      );
      const file = new File([pngBlob], `${props.filenameBase}-${suffix}.png`, {
        type: PNG_CONTENT_TYPE,
      });
      await navigator.share({ files: [file] });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('PNG share failed:', error);
      showToast({ message: 'Failed to share', type: 'error' });
    }
  }

  async function handleCopy(width: number, height: number) {
    try {
      await copySvgToClipboardPng(props.svgUrl, width, height);
      showToast({ message: 'Copied!', type: 'success' });
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      showToast({ message: 'Failed to copy', type: 'error' });
    }
  }

  return (
    <>
      {toast && (
        <div
          className={cx(styles.toast, {
            [styles.toastError]: toast.type === 'error',
          })}
          role="status"
        >
          {toast.message}
        </div>
      )}

      <MenuButton
        ariaLabel="Download options"
        transitionMs={220}
        className={styles.downloadMenu}
        renderMenu={({ closeMenu, menuItemClassName }) => (
          <>
            <button
              type="button"
              role="menuitem"
              className={cx(globalStyles.linkButton, menuItemClassName)}
              onClick={() => {
                closeMenu();
                window.print();
              }}
            >
              Print
            </button>

            <div
              role="group"
              aria-labelledby={svgMenuGroupLabelId}
              className={styles.menuSection}
            >
              <div
                id={svgMenuGroupLabelId}
                className={styles.menuSectionTitle}
              >
                .SVG
              </div>

              <a
                role="menuitem"
                href={props.svgUrl}
                target="_blank"
                className={cx(globalStyles.linkButton, menuItemClassName)}
                onClick={closeMenu}
              >
                <span>Open in new tab</span>
              </a>

              <a
                role="menuitem"
                href={props.svgUrl}
                download={`${props.filenameBase}.svg`}
                className={cx(globalStyles.linkButton, menuItemClassName)}
                onClick={closeMenu}
              >
                <span>Download</span>
              </a>

              {/* SVG share is disabled — most share targets (messaging apps,
                  social media) don't render SVG, so the shared file is
                  effectively useless for non-technical recipients. */}

              {canCopyToClipboard(SVG_CLIPBOARD_TYPE) && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    void handleCopySvg();
                    closeMenu();
                  }}
                >
                  <span>Copy to clipboard</span>
                </button>
              )}
            </div>

            <div
              role="group"
              aria-labelledby={pngMenuGroupLabelId}
              className={styles.menuSection}
            >
              <div
                id={pngMenuGroupLabelId}
                className={styles.menuSectionTitle}
              >
                .PNG
              </div>

              <button
                type="button"
                role="menuitem"
                className={cx(globalStyles.linkButton, menuItemClassName)}
                onClick={() => {
                  closeMenu();

                  void openInNewTabSvgAsPng(
                    props.svgUrl,
                    props.width * PNG_EXPORT_SCALE_SD,
                    props.height * PNG_EXPORT_SCALE_SD,
                  );
                }}
              >
                <span>
                  Open in new tab <small>(SD)</small>
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                className={cx(globalStyles.linkButton, menuItemClassName)}
                onClick={() => {
                  closeMenu();

                  void openInNewTabSvgAsPng(
                    props.svgUrl,
                    props.width * PNG_EXPORT_SCALE_HD,
                    props.height * PNG_EXPORT_SCALE_HD,
                  );
                }}
              >
                <span>
                  Open in new tab <small>(HD)</small>
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                className={cx(globalStyles.linkButton, menuItemClassName)}
                onClick={() => {
                  closeMenu();

                  void downloadSvgAsPng(
                    props.svgUrl,
                    `${props.filenameBase}-SD`,
                    props.width * PNG_EXPORT_SCALE_SD,
                    props.height * PNG_EXPORT_SCALE_SD,
                  );
                }}
              >
                <span>
                  Download <small>(SD)</small>
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                className={cx(globalStyles.linkButton, menuItemClassName)}
                onClick={() => {
                  closeMenu();

                  void downloadSvgAsPng(
                    props.svgUrl,
                    `${props.filenameBase}-HD`,
                    props.width * PNG_EXPORT_SCALE_HD,
                    props.height * PNG_EXPORT_SCALE_HD,
                  );
                }}
              >
                <span>
                  Download <small>(HD)</small>
                </span>
              </button>

              {canShareFile(PNG_CONTENT_TYPE, 'png') && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    void handleSharePng(
                      props.width * PNG_EXPORT_SCALE_SD,
                      props.height * PNG_EXPORT_SCALE_SD,
                      'SD',
                    );
                    closeMenu();
                  }}
                >
                  <span>
                    Share <small>(SD)</small>
                  </span>
                </button>
              )}

              {canShareFile(PNG_CONTENT_TYPE, 'png') && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    void handleSharePng(
                      props.width * PNG_EXPORT_SCALE_HD,
                      props.height * PNG_EXPORT_SCALE_HD,
                      'HD',
                    );
                    closeMenu();
                  }}
                >
                  <span>
                    Share <small>(HD)</small>
                  </span>
                </button>
              )}

              {canCopyToClipboard(PNG_CONTENT_TYPE) && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    // Start the clipboard write BEFORE closing the menu —
                    // some mobile browsers invalidate the user gesture if a
                    // focus/DOM change (from closeMenu) happens first.
                    void handleCopy(
                      props.width * PNG_EXPORT_SCALE_SD,
                      props.height * PNG_EXPORT_SCALE_SD,
                    );
                    closeMenu();
                  }}
                >
                  <span>
                    Copy to clipboard <small>(SD)</small>
                  </span>
                </button>
              )}

              {canCopyToClipboard(PNG_CONTENT_TYPE) && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    void handleCopy(
                      props.width * PNG_EXPORT_SCALE_HD,
                      props.height * PNG_EXPORT_SCALE_HD,
                    );
                    closeMenu();
                  }}
                >
                  <span>
                    Copy to clipboard <small>(HD)</small>
                  </span>
                </button>
              )}
            </div>
          </>
        )}
      >
        {({ isOpen }) => (
          <span
            aria-hidden="true"
            className={styles.menuTriggerIcon}
          >
            {isOpen ? '❌' : '💾'}
          </span>
        )}
      </MenuButton>
    </>
  );
}
