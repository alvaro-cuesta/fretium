import { useMemo, useRef, useState } from 'react';
import { objectEntries, objectKeys } from '../../../lib/object.ts';
import { INSTRUMENTS } from '../../config/instruments.ts';
import { PATTERNS_GROUPED } from '../../config/patterns/patterns.ts';
import {
  historyStateBoolean,
  useHistoryState,
} from '../../hooks/useHistoryState.ts';
import { calculateFretRange } from '../../lib/fret-range.ts';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import type { HistoryStateDeserializeResult } from '../../lib/history-state.ts';
import { NOTES, type Note } from '../../lib/music.ts';
import { markPatternPathAsValidated } from '../../lib/pattern-config.ts';
import { renderPattern } from '../../lib/pattern-engine.ts';
import { getFretboardMetrics } from '../Fretboard/theme.ts';
import { FretboardImg, type ImgChangeEvent } from '../FretboardImg.tsx';
import { Layout } from '../Layout.tsx';
import { SaveMenu } from '../SaveMenu.tsx';
import { Scrollable } from '../Scrollable.tsx';
import styles from './App.module.scss';
import {
  END_FRET_OPTIONS,
  START_FRET_OPTIONS,
  useFretRangeState,
} from './fret-range.ts';
import { HISTORY_STATE_KEYS } from './history.ts';
import { getPatternSelectDescriptors, usePattern } from './pattern.ts';

const DEFAULT_ROOT_NOTE = 'C' satisfies Note;
const DEFAULT_NOTE_DISPLAY_MODE = 'note' as const;
const DEFAULT_SHOW_BACKGROUND_NECK = true;
const DEFAULT_SHOW_STRINGS = true;
const DEFAULT_SHOW_FRET_LINES = true;
const DEFAULT_SHOW_FRET_MARKERS = true;
const DEFAULT_SHOW_FRET_LABELS = true;
const DEFAULT_SHOW_STRING_LABELS = true;
const DEFAULT_SHOW_DROP_SHADOWS = true;

// Root note
function isRootNote(value: unknown): value is Note {
  return (
    typeof value === 'string' && (NOTES as readonly string[]).includes(value)
  );
}

function serializeRootNote(value: Note): Note {
  return value;
}

function deserializeRootNote(
  value: unknown,
): HistoryStateDeserializeResult<Note> {
  return isRootNote(value) ? { type: 'success', value } : { type: 'error' };
}

// Note display mode
const NOTE_DISPLAY_MODE_VALUES: readonly NoteDisplayMode[] = [
  'note',
  'interval',
  'degree',
  'none',
];

function isNoteDisplayMode(value: unknown): value is NoteDisplayMode {
  return (
    typeof value === 'string' &&
    (NOTE_DISPLAY_MODE_VALUES as readonly string[]).includes(value)
  );
}

function serializeNoteDisplayMode(value: NoteDisplayMode): NoteDisplayMode {
  return value;
}

function deserializeNoteDisplayMode(
  value: unknown,
): HistoryStateDeserializeResult<NoteDisplayMode> {
  return isNoteDisplayMode(value)
    ? { type: 'success', value }
    : { type: 'error' };
}

// Instrument + Tuning
type InstrumentTuningOption = `${string}::${string}`;

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

function isInstrumentTuningValue(
  value: unknown,
): value is InstrumentTuningOption {
  return typeof value === 'string' && instrumentTuningByValue.has(value);
}

function serializeInstrumentTuning(
  value: InstrumentTuningOption,
): InstrumentTuningOption {
  return value;
}

function deserializeInstrumentTuning(
  value: unknown,
): HistoryStateDeserializeResult<InstrumentTuningOption> {
  return isInstrumentTuningValue(value)
    ? { type: 'success', value }
    : { type: 'error' };
}

const DEFAULT_INSTRUMENT = 'Guitar' satisfies keyof typeof INSTRUMENTS;
const DEFAULT_INSTRUMENT_TUNING =
  'Standard' satisfies keyof (typeof INSTRUMENTS)[typeof DEFAULT_INSTRUMENT]['tunings'];
const DEFAULT_INSTRUMENT_TUNING_VALUE =
  `${DEFAULT_INSTRUMENT}::${DEFAULT_INSTRUMENT_TUNING}` satisfies InstrumentTuningOption;

///////////

export function App() {
  const [fretboardImg, setFretboardImg] = useState<ImgChangeEvent | null>(null);
  const firstPatternSelectRef = useRef<HTMLSelectElement | null>(null);

  // Fretboard state
  const { patternPath, setPatternPath, patternConfigEntryPattern } =
    usePattern();

  const patternSelects = useMemo(
    () => getPatternSelectDescriptors(patternPath),
    [patternPath],
  );

  const [selectedRootNote, setSelectedRootNote] = useHistoryState(
    HISTORY_STATE_KEYS.selectedRootNote,
    DEFAULT_ROOT_NOTE,
    { serialize: serializeRootNote, deserialize: deserializeRootNote },
  );
  const [selectedNoteDisplayMode, setSelectedNoteDisplayMode] = useHistoryState(
    HISTORY_STATE_KEYS.selectedNoteDisplayMode,
    DEFAULT_NOTE_DISPLAY_MODE,
    {
      serialize: serializeNoteDisplayMode,
      deserialize: deserializeNoteDisplayMode,
    },
  );

  // Instrument tuning
  const [selectedInstrumentTuning, setSelectedInstrumentTuning] =
    useHistoryState(
      HISTORY_STATE_KEYS.selectedInstrumentTuning,
      DEFAULT_INSTRUMENT_TUNING_VALUE,
      {
        serialize: serializeInstrumentTuning,
        deserialize: deserializeInstrumentTuning,
      },
    );
  const resolvedInstrumentTuning = instrumentTuningByValue.get(
    selectedInstrumentTuning,
  );

  if (!resolvedInstrumentTuning) {
    throw new Error('Expected at least one instrument tuning to be available.');
  }

  // Rendered pattern
  const renderPatternResult = useMemo(
    () =>
      renderPattern(
        resolvedInstrumentTuning.tuning,
        patternConfigEntryPattern,
        selectedRootNote,
      ),
    [
      resolvedInstrumentTuning.tuning,
      patternConfigEntryPattern,
      selectedRootNote,
    ],
  );

  // Fret range
  const fretRangeState = useFretRangeState();
  const fretRange = useMemo(
    () => calculateFretRange(fretRangeState, renderPatternResult),
    [fretRangeState, renderPatternResult],
  );

  // Visual options
  const [showBackgroundNeck, setShowBackgroundNeck] = useHistoryState(
    HISTORY_STATE_KEYS.showBackgroundNeck,
    DEFAULT_SHOW_BACKGROUND_NECK,
    historyStateBoolean,
  );
  const [showStrings, setShowStrings] = useHistoryState(
    HISTORY_STATE_KEYS.showStrings,
    DEFAULT_SHOW_STRINGS,
    historyStateBoolean,
  );
  const [showFretLines, setShowFretLines] = useHistoryState(
    HISTORY_STATE_KEYS.showFretLines,
    DEFAULT_SHOW_FRET_LINES,
    historyStateBoolean,
  );
  const [showFretMarkers, setShowFretMarkers] = useHistoryState(
    HISTORY_STATE_KEYS.showFretMarkers,
    DEFAULT_SHOW_FRET_MARKERS,
    historyStateBoolean,
  );
  const [showFretLabels, setShowFretLabels] = useHistoryState(
    HISTORY_STATE_KEYS.showFretLabels,
    DEFAULT_SHOW_FRET_LABELS,
    historyStateBoolean,
  );
  const [showStringLabels, setShowStringLabels] = useHistoryState(
    HISTORY_STATE_KEYS.showStringLabels,
    DEFAULT_SHOW_STRING_LABELS,
    historyStateBoolean,
  );
  const [showDropShadows, setShowDropShadows] = useHistoryState(
    HISTORY_STATE_KEYS.showDropShadows,
    DEFAULT_SHOW_DROP_SHADOWS,
    historyStateBoolean,
  );

  //////

  const fretboardMetrics = useMemo(
    () =>
      getFretboardMetrics({
        startFret: fretRange.start,
        endFret: fretRange.end,
        tuning: resolvedInstrumentTuning.tuning,
        showStringLabels,
        showFretLabels,
      }),
    [
      fretRange.start,
      fretRange.end,
      resolvedInstrumentTuning.tuning,
      showStringLabels,
      showFretLabels,
    ],
  );

  return (
    <Layout>
      <section className={styles.controlsSection}>
        <form
          className={styles.controlsForm}
          // Elements here have autoComplete="off" to prevent Firefox from changing DOM values on
          // history navigation/restoring closed tab/duplicating tab, which causes React internal
          // state to desync from DOM
          // For some reason it didn't work here in <form> and I had to add it to each individual
          // input/select element
        >
          <label className={`${styles.fieldGroup} ${styles.instrumentField}`}>
            <span className={styles.fieldLabel}>Instrument</span>
            <select
              className={styles.selectorInput}
              value={resolvedInstrumentTuning.value}
              onChange={(e) => {
                setSelectedInstrumentTuning(
                  e.target.value as InstrumentTuningOption,
                );
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

          <div className={`${styles.rangeFields} ${styles.fretRangeFields}`}>
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

          <div className={`${styles.fieldGroup} ${styles.patternField}`}>
            <fieldset className={styles.patternFieldset}>
              <legend className={styles.patternLegend}>
                <span
                  className={`${styles.fieldLabel} ${styles.legendButton}`}
                  onClick={() => {
                    firstPatternSelectRef.current?.focus();
                  }}
                >
                  Pattern
                </span>
              </legend>

              <div
                className={`${styles.rangeFields} ${styles.patternSelectsRow}`}
              >
                {patternSelects.map((patternSelect, depth) => (
                  <select
                    key={
                      depth === 0
                        ? 'pattern-root'
                        : `pattern-${patternPath.slice(0, depth).join('/')}`
                    }
                    ref={depth === 0 ? firstPatternSelectRef : undefined}
                    className={styles.selectorInput}
                    value={patternSelect.value}
                    onChange={(e) => {
                      const nextSegment = e.target.value;

                      setPatternPath((currentPath) =>
                        markPatternPathAsValidated(PATTERNS_GROUPED, [
                          ...currentPath.slice(0, depth),
                          nextSegment,
                          ...currentPath.slice(depth + 1),
                        ]),
                      );
                    }}
                    autoComplete="off"
                    aria-label={patternSelect.ariaLabel}
                  >
                    {patternSelect.options.options.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.displayName}
                      </option>
                    ))}
                    {patternSelect.options.groups.map((group) => (
                      <optgroup
                        key={`group-${group.id}`}
                        label={group.displayName}
                      >
                        {group.options.map((option) => (
                          <option
                            key={`${group.id}-${option.value}`}
                            value={option.value}
                          >
                            {option.displayName}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                ))}
              </div>
            </fieldset>
          </div>

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
              {NOTES.map((rootNote) => (
                <option
                  key={rootNote}
                  value={rootNote}
                >
                  {rootNote}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.checkboxRow}>
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
            pattern={patternConfigEntryPattern}
            patternName={patternConfigEntryPattern.displayName}
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
          <SaveMenu
            svgUrl={fretboardImg.url}
            filenameBase={fretboardImg.filenameBase}
            width={fretboardMetrics.total.width}
            height={fretboardMetrics.total.height}
          />
        )}
      </section>
    </Layout>
  );
}
