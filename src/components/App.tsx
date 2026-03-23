import cx from 'classnames';
import { useId, useState } from 'react';
import { objectEntries, objectKeys } from '../../lib/object.ts';
import { INSTRUMENTS } from '../config/instruments.ts';
import {
  PATTERNS,
  PATTERNS_GROUPED,
  type PatternName,
} from '../config/patterns.ts';
import { useLenientInput } from '../hooks/useLenientInput.ts';
import globalStyles from '../index.module.scss';
import { downloadBlob, PNG_CONTENT_TYPE } from '../lib/file.ts';
import { type NoteDisplayMode } from '../lib/fretboard.ts';
import { rasterizeSvg } from '../lib/image.ts';
import { clamp } from '../lib/math.ts';
import type { Note } from '../lib/music.ts';
import styles from './App.module.scss';
import { getFretboardMetrics } from './Fretboard/theme.ts';
import { FretboardImg, type ImgChangeEvent } from './FretboardImg.tsx';
import { Layout } from './Layout.tsx';
import { MenuButton } from './MenuButton.tsx';
import { Scrollable } from './Scrollable.tsx';

const ROOT_NOTES = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
] as const satisfies readonly Note[];

const DEFAULT_PATTERN = 'Major scale' satisfies PatternName;
const DEFAULT_ROOT_NOTE = 'C' satisfies Note;
const DEFAULT_NOTE_DISPLAY_MODE = 'note' as const;
const DEFAULT_SHOW_BACKGROUND_NECK = true;
const DEFAULT_SHOW_STRINGS = true;
const DEFAULT_SHOW_FRET_LINES = true;
const DEFAULT_SHOW_FRET_MARKERS = true;
const DEFAULT_SHOW_FRET_LABELS = true;
const DEFAULT_SHOW_STRING_LABELS = true;
const DEFAULT_SHOW_DROP_SHADOWS = true;

const PNG_EXPORT_SCALE_SD = 2 as const;
const PNG_EXPORT_SCALE_HD = 4 as const;

const instrumentTuningGroups = objectEntries(INSTRUMENTS).map(
  ([instrumentName, instrument]) => ({
    instrumentName,
    tunings: objectEntries(instrument.tunings).map(([tuningName, tuning]) => ({
      value: `${instrumentName}::${tuningName}`,
      label: `${instrumentName} ${tuningName}`,
      tuning,
      stringCount: instrument.strings,
      instrumentName,
      tuningName,
    })),
  }),
);

const MIN_FRET = 0;
const MAX_FRET = 48;
const INTEGER_INPUT_PATTERN = /^\d+$/;

const DEFAULT_START_FRET = 0;
const DEFAULT_END_FRET = 14;

const DEFAULT_INSTRUMENT = 'Guitar' satisfies keyof typeof INSTRUMENTS;
const DEFAULT_INSTRUMENT_TUNING =
  'Standard' satisfies keyof (typeof INSTRUMENTS)[typeof DEFAULT_INSTRUMENT]['tunings'];
const DEFAULT_INSTRUMENT_TUNING_VALUE = `${DEFAULT_INSTRUMENT}::${DEFAULT_INSTRUMENT_TUNING}`;

function deriveFretValue(
  inputValue: string,
  currentValue: number,
  min: number,
  max: number,
) {
  const trimmedValue = inputValue.trim();
  if (trimmedValue === '') return currentValue;

  if (!INTEGER_INPUT_PATTERN.test(trimmedValue)) return currentValue;

  const parsedValue = Number(trimmedValue);
  if (Number.isNaN(parsedValue)) return currentValue;

  return clamp(parsedValue, min, max);
}

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

export function App() {
  const svgMenuGroupLabelId = useId();
  const pngMenuGroupLabelId = useId();

  const [fretboardImg, setFretboardImg] = useState<ImgChangeEvent | null>(null);
  const [selectedPattern, setSelectedPattern] =
    useState<PatternName>(DEFAULT_PATTERN);
  const pattern = PATTERNS[selectedPattern];
  const [selectedRootNote, setSelectedRootNote] =
    useState<Note>(DEFAULT_ROOT_NOTE);
  const [selectedNoteDisplayMode, setSelectedNoteDisplayMode] =
    useState<NoteDisplayMode>(DEFAULT_NOTE_DISPLAY_MODE);
  const [showBackgroundNeck, setShowBackgroundNeck] = useState(
    DEFAULT_SHOW_BACKGROUND_NECK,
  );
  const [showStrings, setShowStrings] = useState(DEFAULT_SHOW_STRINGS);
  const [showFretLines, setShowFretLines] = useState(DEFAULT_SHOW_FRET_LINES);
  const [showFretMarkers, setShowFretMarkers] = useState(
    DEFAULT_SHOW_FRET_MARKERS,
  );
  const [showFretLabels, setShowFretLabels] = useState(
    DEFAULT_SHOW_FRET_LABELS,
  );
  const [showStringLabels, setShowStringLabels] = useState(
    DEFAULT_SHOW_STRING_LABELS,
  );
  const [showDropShadows, setShowDropShadows] = useState(
    DEFAULT_SHOW_DROP_SHADOWS,
  );

  // Instrument tuning
  const [selectedInstrumentTuning, setSelectedInstrumentTuning] = useState(
    DEFAULT_INSTRUMENT_TUNING_VALUE,
  );
  const resolvedInstrumentTuning = instrumentTuningGroups
    .flatMap((group) => group.tunings)
    .find((option) => option.value === selectedInstrumentTuning);

  if (!resolvedInstrumentTuning) {
    throw new Error('Expected at least one instrument tuning to be available.');
  }

  // Start/end fret
  const [startFret, setStartFret] = useState(DEFAULT_START_FRET);
  const [endFret, setEndFret] = useState(DEFAULT_END_FRET);
  const startFretInputProps = useLenientInput<number>({
    value: startFret,
    setValue: setStartFret,
    deriveValue: (inputValue, currentValue) =>
      deriveFretValue(inputValue, currentValue, MIN_FRET, endFret),
    formatValue: (value) => String(value),
  });
  const endFretInputProps = useLenientInput<number>({
    value: endFret,
    setValue: setEndFret,
    deriveValue: (inputValue, currentValue) =>
      deriveFretValue(inputValue, currentValue, startFret, MAX_FRET),
    formatValue: (value) => String(value),
  });

  return (
    <Layout>
      <section className={styles.controlsSection}>
        <div className={styles.controlsRow}>
          <label className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Instrument</span>
            <select
              className={styles.selectorInput}
              value={resolvedInstrumentTuning.value}
              onChange={(e) => {
                setSelectedInstrumentTuning(e.target.value);
              }}
            >
              {objectEntries(INSTRUMENTS).map(
                ([instrumentName, instrument]) => (
                  <optgroup
                    key={instrumentName}
                    label={instrumentName}
                  >
                    {objectKeys(instrument.tunings).map((tuningName) => {
                      const value = `${instrumentName}::${tuningName}`;
                      const label = `${instrumentName} ${tuningName}`;
                      return (
                        <option
                          key={value}
                          value={value}
                        >
                          {label}
                        </option>
                      );
                    })}
                  </optgroup>
                ),
              )}
            </select>
          </label>

          <div className={styles.rangeFields}>
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Start fret</span>
              <input
                className={styles.fretRangeInput}
                type="number"
                min={MIN_FRET}
                max={endFret}
                {...startFretInputProps}
              />
            </label>
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>End fret</span>
              <input
                className={styles.fretRangeInput}
                type="number"
                min={startFret}
                max={MAX_FRET}
                {...endFretInputProps}
              />
            </label>
          </div>

          <label className={`${styles.fieldGroup} ${styles.noteLabelsField}`}>
            <span className={styles.fieldLabel}>Note labels</span>
            <select
              className={styles.selectorInput}
              value={selectedNoteDisplayMode}
              onChange={(e) => {
                setSelectedNoteDisplayMode(e.target.value as NoteDisplayMode);
              }}
            >
              <option value="note">Note</option>
              <option value="interval">Intervals</option>
              <option value="degree">Degrees</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>

        <div className={`${styles.controlsRow} ${styles.controlsRowFill}`}>
          <label className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Pattern</span>
            <select
              className={styles.selectorInput}
              value={selectedPattern}
              onChange={(e) => {
                setSelectedPattern(e.target.value as PatternName);
              }}
            >
              {objectEntries(PATTERNS_GROUPED).map(([groupName, patterns]) => (
                <optgroup
                  key={groupName}
                  label={groupName}
                >
                  {objectKeys(patterns).map((patternName) => (
                    <option
                      key={patternName}
                      value={patternName}
                    >
                      {patternName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label className={`${styles.fieldGroup} ${styles.rootNoteField}`}>
            <span className={styles.fieldLabel}>Root note</span>
            <select
              className={styles.selectorInput}
              value={selectedRootNote}
              onChange={(e) => {
                setSelectedRootNote(e.target.value as Note);
              }}
            >
              {ROOT_NOTES.map((rootNote) => (
                <option
                  key={rootNote}
                  value={rootNote}
                >
                  {rootNote}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={`${styles.controlsRow} ${styles.controlsRowFill}`}>
          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showBackgroundNeck}
              onChange={(e) => {
                setShowBackgroundNeck(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>Background</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showStrings}
              onChange={(e) => {
                setShowStrings(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>Strings</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showFretLines}
              onChange={(e) => {
                setShowFretLines(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>Fret lines</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showFretMarkers}
              onChange={(e) => {
                setShowFretMarkers(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>Fret markers</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showFretLabels}
              onChange={(e) => {
                setShowFretLabels(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>Fret labels</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showStringLabels}
              onChange={(e) => {
                setShowStringLabels(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>String labels</span>
          </label>

          <label className={styles.checkboxField}>
            <input
              className={styles.checkboxInput}
              type="checkbox"
              checked={showDropShadows}
              onChange={(e) => {
                setShowDropShadows(e.target.checked);
              }}
            />
            <span className={styles.checkboxLabel}>Drop shadows</span>
          </label>
        </div>
      </section>

      <section className={styles.fretboardSection}>
        <Scrollable>
          <FretboardImg
            className={styles.fretboardImg}
            onImgChange={(nextFretboardImg) => {
              setFretboardImg(nextFretboardImg);
            }}
            pattern={pattern}
            patternName={selectedPattern}
            instrumentName={resolvedInstrumentTuning.instrumentName}
            tuningName={resolvedInstrumentTuning.tuningName}
            tuning={resolvedInstrumentTuning.tuning}
            startFret={startFret}
            endFret={endFret}
            showBackgroundNeck={showBackgroundNeck}
            showStrings={showStrings}
            showFretLines={showFretLines}
            showFretMarkers={showFretMarkers}
            showFretLabels={showFretLabels}
            showStringLabels={showStringLabels}
            showDropShadows={showDropShadows}
            noteDisplayMode={selectedNoteDisplayMode}
            rootNote={selectedRootNote}
          />
        </Scrollable>

        {fretboardImg && (
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
                    href={fretboardImg.url}
                    target="_blank"
                    className={cx(globalStyles.linkButton, menuItemClassName)}
                    onClick={closeMenu}
                  >
                    <span>Open in new tab</span>
                  </a>

                  <a
                    role="menuitem"
                    href={fretboardImg.url}
                    download={`${fretboardImg.filenameBase}.svg`}
                    className={cx(globalStyles.linkButton, menuItemClassName)}
                    onClick={closeMenu}
                  >
                    <span>Download</span>
                  </a>
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

                  {/* `navigator.clipboard.write` fails with SVG content type, so no SVG copy */}

                  <button
                    type="button"
                    role="menuitem"
                    className={cx(globalStyles.linkButton, menuItemClassName)}
                    onClick={() => {
                      closeMenu();

                      const metrics = getFretboardMetrics({
                        startFret,
                        endFret,
                        tuning: resolvedInstrumentTuning.tuning,
                        showStringLabels,
                        showFretLabels,
                      });

                      void downloadSvgAsPng(
                        fretboardImg.url,
                        `${fretboardImg.filenameBase}-SD`,
                        metrics.total.width * PNG_EXPORT_SCALE_SD,
                        metrics.total.height * PNG_EXPORT_SCALE_SD,
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

                      const metrics = getFretboardMetrics({
                        startFret,
                        endFret,
                        tuning: resolvedInstrumentTuning.tuning,
                        showStringLabels,
                        showFretLabels,
                      });

                      void downloadSvgAsPng(
                        fretboardImg.url,
                        `${fretboardImg.filenameBase}-HD`,
                        metrics.total.width * PNG_EXPORT_SCALE_HD,
                        metrics.total.height * PNG_EXPORT_SCALE_HD,
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

                      const metrics = getFretboardMetrics({
                        startFret,
                        endFret,
                        tuning: resolvedInstrumentTuning.tuning,
                        showStringLabels,
                        showFretLabels,
                      });

                      void copySvgToClipboardPng(
                        fretboardImg.url,
                        metrics.total.width * PNG_EXPORT_SCALE_SD,
                        metrics.total.height * PNG_EXPORT_SCALE_SD,
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

                      const metrics = getFretboardMetrics({
                        startFret,
                        endFret,
                        tuning: resolvedInstrumentTuning.tuning,
                        showStringLabels,
                        showFretLabels,
                      });

                      void copySvgToClipboardPng(
                        fretboardImg.url,
                        metrics.total.width * PNG_EXPORT_SCALE_HD,
                        metrics.total.height * PNG_EXPORT_SCALE_HD,
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
        )}
      </section>
    </Layout>
  );
}
