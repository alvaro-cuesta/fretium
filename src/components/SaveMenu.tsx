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

// Whether the browser supports programmatic clipboard writes. When false the
// "Copy to clipboard" menu items are hidden entirely.
const CAN_COPY_TO_CLIPBOARD =
  typeof ClipboardItem !== 'undefined' &&
  typeof navigator.clipboard?.write === 'function';

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

  async function handleCopy(width: number, height: number) {
    try {
      await copySvgToClipboardPng(props.svgUrl, width, height);
      showToast({ message: 'Copied!', type: 'success' });
    } catch {
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

              {/* `navigator.clipboard.write` fails with SVG content type, so no SVG copy */}
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

              {CAN_COPY_TO_CLIPBOARD && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    closeMenu();

                    void handleCopy(
                      props.width * PNG_EXPORT_SCALE_SD,
                      props.height * PNG_EXPORT_SCALE_SD,
                    );
                  }}
                >
                  <span>
                    Copy to clipboard <small>(SD)</small>
                  </span>
                </button>
              )}

              {CAN_COPY_TO_CLIPBOARD && (
                <button
                  type="button"
                  role="menuitem"
                  className={cx(globalStyles.linkButton, menuItemClassName)}
                  onClick={() => {
                    closeMenu();

                    void handleCopy(
                      props.width * PNG_EXPORT_SCALE_HD,
                      props.height * PNG_EXPORT_SCALE_HD,
                    );
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
