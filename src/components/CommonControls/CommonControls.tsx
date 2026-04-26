import cx from 'classnames';
import { objectKeys } from '../../../lib/object.ts';
import { INSTRUMENTS } from '../../config/instruments.ts';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import { type CommonConfig } from '../App/common-config.ts';
import {
  INSTRUMENT_TUNING_GROUPS,
  type InstrumentTuningOption,
} from '../App/instrument-tuning.ts';
import styles from './CommonControls.module.scss';

type CommonControlsProps = {
  config: CommonConfig;
  onChange: (next: CommonConfig) => void;
};

export function CommonControls({ config, onChange }: CommonControlsProps) {
  const patch = (next: Partial<CommonConfig>) => {
    onChange({ ...config, ...next });
  };

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
      </form>
    </section>
  );
}
