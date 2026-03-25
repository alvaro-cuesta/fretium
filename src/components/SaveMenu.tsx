import cx from 'classnames';
import { useId } from 'react';
import globalStyles from '../index.module.scss';
import { downloadBlob, PNG_CONTENT_TYPE } from '../lib/file';
import { rasterizeSvg } from '../lib/image';
import { MenuButton } from './MenuButton';
import styles from './SaveMenu.module.scss';

const PNG_EXPORT_SCALE_SD = 2 as const;
const PNG_EXPORT_SCALE_HD = 4 as const;

async function copyToClipboard(
  contentType: string,
  data: string | Blob | PromiseLike<string | Blob>,
) {
  await navigator.clipboard.write([new ClipboardItem({ [contentType]: data })]);
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

async function copySvgToClipboardPng(
  svgUrl: string,
  width: number,
  height: number,
) {
  const pngBlob = await rasterizeSvg(svgUrl, PNG_CONTENT_TYPE, width, height);
  await copyToClipboard(PNG_CONTENT_TYPE, pngBlob);
}

type SaveMenuProps = {
  svgUrl: string;
  filenameBase: string;
  width: number;
  height: number;
};

export function SaveMenu(props: SaveMenuProps) {
  const svgMenuGroupLabelId = useId();
  const pngMenuGroupLabelId = useId();

  return (
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

            <button
              type="button"
              role="menuitem"
              className={cx(globalStyles.linkButton, menuItemClassName)}
              onClick={() => {
                closeMenu();

                void copySvgToClipboardPng(
                  props.svgUrl,
                  props.width * PNG_EXPORT_SCALE_SD,
                  props.height * PNG_EXPORT_SCALE_SD,
                );
              }}
            >
              <span>
                Copy to clipboard <small>(SD)</small>
              </span>
            </button>

            <button
              type="button"
              role="menuitem"
              className={cx(globalStyles.linkButton, menuItemClassName)}
              onClick={() => {
                closeMenu();

                void copySvgToClipboardPng(
                  props.svgUrl,
                  props.width * PNG_EXPORT_SCALE_HD,
                  props.height * PNG_EXPORT_SCALE_HD,
                );
              }}
            >
              <span>
                Copy to clipboard <small>(HD)</small>
              </span>
            </button>
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
  );
}
