import cx from 'classnames';
import { useId, useMemo, useState } from 'react';
import { objectEntries, objectKeys } from '../../../lib/object.ts';
import { INSTRUMENTS } from '../../config/instruments.ts';
import {
  PATTERNS,
  PATTERNS_GROUPED,
  type PatternName,
} from '../../config/patterns.ts';
import { useHistoryState } from '../../hooks/useHistoryState.ts';
import globalStyles from '../../index.module.scss';
import { downloadBlob, PNG_CONTENT_TYPE } from '../../lib/file.ts';
import { calculateFretRange } from '../../lib/fret-range.ts';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import { rasterizeSvg } from '../../lib/image.ts';
import type { Note } from '../../lib/music.ts';
import { renderPattern } from '../../lib/pattern-engine.ts';
import { getFretboardMetrics } from '../Fretboard/theme.ts';
import { FretboardImg, type ImgChangeEvent } from '../FretboardImg.tsx';
import { Layout } from '../Layout.tsx';
import { MenuButton } from '../MenuButton.tsx';
import { Scrollable } from '../Scrollable.tsx';
import styles from './App.module.scss';
import {
  END_FRET_OPTIONS,
  START_FRET_OPTIONS,
  useFretRangeState,
} from './fret-range.ts';
import { HISTORY_STATE_KEYS } from './history.ts';

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

const NOTE_DISPLAY_MODE_VALUES: readonly NoteDisplayMode[] = [
  'note',
  'interval',
  'degree',
  'none',
];

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isPatternName(value: unknown): value is PatternName {
  return typeof value === 'string' && Object.hasOwn(PATTERNS, value);
}

function isRootNote(value: unknown): value is Note {
  return (
    typeof value === 'string' &&
    (ROOT_NOTES as readonly string[]).includes(value)
  );
}

function isNoteDisplayMode(value: unknown): value is NoteDisplayMode {
  return (
    typeof value === 'string' &&
    (NOTE_DISPLAY_MODE_VALUES as readonly string[]).includes(value)
  );
}

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

const instrumentTuningOptions = instrumentTuningGroups.flatMap(
  (group) => group.tunings,
);
const instrumentTuningByValue = new Map(
  instrumentTuningOptions.map((option) => [option.value, option]),
);

function isInstrumentTuningValue(value: unknown): value is string {
  return typeof value === 'string' && instrumentTuningByValue.has(value);
}

const DEFAULT_INSTRUMENT = 'Guitar' satisfies keyof typeof INSTRUMENTS;
const DEFAULT_INSTRUMENT_TUNING =
  'Standard' satisfies keyof (typeof INSTRUMENTS)[typeof DEFAULT_INSTRUMENT]['tunings'];
const DEFAULT_INSTRUMENT_TUNING_VALUE = `${DEFAULT_INSTRUMENT}::${DEFAULT_INSTRUMENT_TUNING}`;

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
  const [selectedPattern, setSelectedPattern] = useHistoryState<PatternName>(
    HISTORY_STATE_KEYS.selectedPattern,
    DEFAULT_PATTERN,
    { isValid: isPatternName },
  );
  const pattern = PATTERNS[selectedPattern];
  const [selectedRootNote, setSelectedRootNote] = useHistoryState<Note>(
    HISTORY_STATE_KEYS.selectedRootNote,
    DEFAULT_ROOT_NOTE,
    { isValid: isRootNote },
  );
  const [selectedNoteDisplayMode, setSelectedNoteDisplayMode] =
    useHistoryState<NoteDisplayMode>(
      HISTORY_STATE_KEYS.selectedNoteDisplayMode,
      DEFAULT_NOTE_DISPLAY_MODE,
      { isValid: isNoteDisplayMode },
    );
  const [showBackgroundNeck, setShowBackgroundNeck] = useHistoryState(
    HISTORY_STATE_KEYS.showBackgroundNeck,
    DEFAULT_SHOW_BACKGROUND_NECK,
    { isValid: isBoolean },
  );
  const [showStrings, setShowStrings] = useHistoryState(
    HISTORY_STATE_KEYS.showStrings,
    DEFAULT_SHOW_STRINGS,
    { isValid: isBoolean },
  );
  const [showFretLines, setShowFretLines] = useHistoryState(
    HISTORY_STATE_KEYS.showFretLines,
    DEFAULT_SHOW_FRET_LINES,
    { isValid: isBoolean },
  );
  const [showFretMarkers, setShowFretMarkers] = useHistoryState(
    HISTORY_STATE_KEYS.showFretMarkers,
    DEFAULT_SHOW_FRET_MARKERS,
    { isValid: isBoolean },
  );
  const [showFretLabels, setShowFretLabels] = useHistoryState(
    HISTORY_STATE_KEYS.showFretLabels,
    DEFAULT_SHOW_FRET_LABELS,
    { isValid: isBoolean },
  );
  const [showStringLabels, setShowStringLabels] = useHistoryState(
    HISTORY_STATE_KEYS.showStringLabels,
    DEFAULT_SHOW_STRING_LABELS,
    { isValid: isBoolean },
  );
  const [showDropShadows, setShowDropShadows] = useHistoryState(
    HISTORY_STATE_KEYS.showDropShadows,
    DEFAULT_SHOW_DROP_SHADOWS,
    { isValid: isBoolean },
  );

  // Instrument tuning
  const [selectedInstrumentTuning, setSelectedInstrumentTuning] =
    useHistoryState(
      HISTORY_STATE_KEYS.selectedInstrumentTuning,
      DEFAULT_INSTRUMENT_TUNING_VALUE,
      {
        isValid: isInstrumentTuningValue,
      },
    );
  const resolvedInstrumentTuning = instrumentTuningByValue.get(
    selectedInstrumentTuning,
  );

  if (!resolvedInstrumentTuning) {
    throw new Error('Expected at least one instrument tuning to be available.');
  }

  const renderPatternResult = useMemo(
    () =>
      renderPattern(resolvedInstrumentTuning.tuning, pattern, selectedRootNote),
    [resolvedInstrumentTuning.tuning, pattern, selectedRootNote],
  );

  // Start/end fret
  const fretRangeState = useFretRangeState();
  const fretRange = calculateFretRange(fretRangeState, renderPatternResult);

  return (
    <Layout>
      <section className={styles.controlsSection}>
        <form
        // Elements here have autoComplete="off" to prevent Firefox from changing DOM values on
        // history navigation/restoring closed tab/duplicating tab, which causes React internal
        // state to desync from DOM
        // For some reason it didn't work here in <form> and I had to add it to each individual
        // input/select element
        >
          <div className={styles.controlsRow}>
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>Instrument</span>
              <select
                className={styles.selectorInput}
                value={resolvedInstrumentTuning.value}
                onChange={(e) => {
                  setSelectedInstrumentTuning(e.target.value);
                }}
                autoComplete="off"
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
                <select
                  className={styles.selectorInput}
                  value={fretRangeState.start}
                  onChange={(e) => {
                    fretRangeState.setStart(e.target.value);
                  }}
                  autoComplete="off"
                >
                  {START_FRET_OPTIONS.map(({ label, value }) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>End fret</span>
                <select
                  className={styles.selectorInput}
                  value={fretRangeState.end}
                  onChange={(e) => {
                    fretRangeState.setEnd(e.target.value);
                  }}
                  autoComplete="off"
                >
                  {END_FRET_OPTIONS.map(({ label, value }) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
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
                autoComplete="off"
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
                autoComplete="off"
              >
                {objectEntries(PATTERNS_GROUPED).map(
                  ([groupName, patterns]) => (
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
                  ),
                )}
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
              />
              <span className={styles.checkboxLabel}>Drop shadows</span>
            </label>
          </div>
        </form>
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
            startFret={fretRange.start}
            endFret={fretRange.end}
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
                        startFret: fretRange.start,
                        endFret: fretRange.end,
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
                        startFret: fretRange.start,
                        endFret: fretRange.end,
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
                        startFret: fretRange.start,
                        endFret: fretRange.end,
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
                        startFret: fretRange.start,
                        endFret: fretRange.end,
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
