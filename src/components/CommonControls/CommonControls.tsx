import cx from 'classnames';
import { objectKeys } from '../../../lib/object.ts';
import { INSTRUMENTS } from '../../config/instruments.ts';
import { PNG_CONTENT_TYPE } from '../../lib/file.ts';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import { rasterizeSvg } from '../../lib/image.ts';
import { type CommonConfig } from '../App/common-config.ts';
import {
  INSTRUMENT_TUNING_BY_VALUE,
  INSTRUMENT_TUNING_GROUPS,
  type InstrumentTuningOption,
} from '../App/instrument-tuning.ts';
import type { PanelImgData } from '../App/panel-img-data.ts';
import { PrinterIcon, ShareIcon } from '../FretboardPanel/icons.tsx';
import styles from './CommonControls.module.scss';

const PNG_EXPORT_SCALE_SD = 2 as const;
const PNG_EXPORT_SCALE_HD = 4 as const;

function canShareFile(contentType: string, extension: string) {
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return false;
  const testFile = new File([], `test.${extension}`, { type: contentType });
  return navigator.canShare({ files: [testFile] });
}

type CommonControlsProps = {
  config: CommonConfig;
  onChange: (next: CommonConfig) => void;
  onPrintAll: () => void;
  allPanelImgData: readonly PanelImgData[];
};

export function CommonControls({
  config,
  onChange,
  onPrintAll,
  allPanelImgData,
}: CommonControlsProps) {
  const patch = (next: Partial<CommonConfig>) => {
    onChange({ ...config, ...next });
  };

  const resolved = INSTRUMENT_TUNING_BY_VALUE.get(config.instrumentTuning);
  const instrumentLabel = resolved
    ? `${resolved.instrumentName} ${resolved.tuningName} (${resolved.tuning.join(' ')})`
    : config.instrumentTuning;

  const shareText = `${instrumentLabel}\n\nMade with ${import.meta.env.PACKAGE_HOMEPAGE}`;

  async function handleShareAll(scale: number, suffix: string) {
    try {
      const files = await Promise.all(
        allPanelImgData.map(async (panel) => {
          const pngBlob = await rasterizeSvg(
            panel.svgUrl,
            PNG_CONTENT_TYPE,
            panel.width * scale,
            panel.height * scale,
          );
          return new File([pngBlob], `${panel.filenameBase}-${suffix}.png`, {
            type: PNG_CONTENT_TYPE,
          });
        }),
      );
      await navigator.share({ text: shareText, files });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Share all failed:', error);
    }
  }

  return (
    <section
      className={styles.controlsSection}
      aria-label="Common controls"
    >
      <form className={styles.controlsForm}>
        <label className={cx(styles.fieldGroup, styles.instrumentField)}>
          <span className={styles.fieldLabel}>Instrument</span>
          <select
            className={styles.selectorInput}
            value={config.instrumentTuning}
            onChange={(e) => {
              patch({
                instrumentTuning: e.target.value as InstrumentTuningOption,
              });
            }}
            autoComplete="off"
          >
            {INSTRUMENT_TUNING_GROUPS.map((group) => (
              <optgroup
                key={group.instrumentName}
                label={group.instrumentName}
              >
                {objectKeys(INSTRUMENTS[group.instrumentName].tunings).map(
                  (tuningName) => {
                    const value = `${group.instrumentName}::${tuningName}`;
                    const label = `${group.instrumentName} ${tuningName}`;
                    return (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    );
                  },
                )}
              </optgroup>
            ))}
          </select>
        </label>

        <label className={cx(styles.fieldGroup, styles.noteLabelsField)}>
          <span className={styles.fieldLabel}>Note labels</span>
          <select
            className={styles.selectorInput}
            value={config.noteDisplayMode}
            onChange={(e) => {
              patch({
                noteDisplayMode: e.target.value as NoteDisplayMode,
              });
            }}
            autoComplete="off"
          >
            <option value="note">Note</option>
            <option value="interval">Intervals</option>
            <option value="degree">Degrees</option>
            <option value="none">None</option>
          </select>
        </label>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={config.showFretMarkers}
              onChange={(e) => {
                patch({ showFretMarkers: e.target.checked });
              }}
              autoComplete="off"
            />
            <span className={styles.checkboxLabel}>Fret markers</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={config.showFretLabels}
              onChange={(e) => {
                patch({ showFretLabels: e.target.checked });
              }}
              autoComplete="off"
            />
            <span className={styles.checkboxLabel}>Fret labels</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={config.showFretLines}
              onChange={(e) => {
                patch({ showFretLines: e.target.checked });
              }}
              autoComplete="off"
            />
            <span className={styles.checkboxLabel}>Fret lines</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={config.showStringLabels}
              onChange={(e) => {
                patch({ showStringLabels: e.target.checked });
              }}
              autoComplete="off"
            />
            <span className={styles.checkboxLabel}>String labels</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={config.showBackgroundNeck}
              onChange={(e) => {
                patch({ showBackgroundNeck: e.target.checked });
              }}
              autoComplete="off"
            />
            <span className={styles.checkboxLabel}>Background</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={config.showDropShadows}
              onChange={(e) => {
                patch({ showDropShadows: e.target.checked });
              }}
              autoComplete="off"
            />
            <span className={styles.checkboxLabel}>Drop shadows</span>
          </label>
        </div>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={onPrintAll}
          >
            <PrinterIcon /> <span>Print all</span>
          </button>

          {canShareFile(PNG_CONTENT_TYPE, 'png') &&
            allPanelImgData.length > 0 && (
              <>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => {
                    void handleShareAll(PNG_EXPORT_SCALE_SD, 'SD');
                  }}
                >
                  <ShareIcon />{' '}
                  <span>
                    Share all <small>(SD)</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => {
                    void handleShareAll(PNG_EXPORT_SCALE_HD, 'HD');
                  }}
                >
                  <ShareIcon />{' '}
                  <span>
                    Share all <small>(HD)</small>
                  </span>
                </button>
              </>
            )}
        </div>
      </form>
    </section>
  );
}
