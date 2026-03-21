import { useState } from 'react';
import { objectEntries, objectKeys } from '../../lib/object.ts';
import {
  DEFINITIONS,
  DEFINITIONS_GROUPED,
  type DefinitionPresetName,
} from '../config/definitions.ts';
import { INSTRUMENTS } from '../config/instruments.ts';
import { useLenientInput } from '../hooks/useLenientInput.ts';
import { clamp } from '../lib/math.ts';
import type { Note } from '../lib/music.ts';
import styles from './App.module.scss';
import { FretboardImg } from './FretboardImg.tsx';
import { Layout } from './Layout.tsx';
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

const DEFAULT_DEFINITION_PRESET = 'Major scale' satisfies DefinitionPresetName;
const DEFAULT_ROOT_NOTE = 'C' satisfies Note;
const DEFAULT_NOTE_DISPLAY_MODE = 'note' as const;
export type NoteDisplayMode = 'note' | 'interval' | 'degree' | 'none';

const instrumentTuningGroups = objectEntries(INSTRUMENTS).map(
  ([instrumentName, instrument]) => ({
    instrumentName,
    tunings: objectEntries(instrument.tunings).map(([tuningName, tuning]) => ({
      value: `${instrumentName}::${tuningName}`,
      label: `${instrumentName} ${tuningName}`,
      tuning,
      stringCount: instrument.strings,
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

export function App() {
  const [selectedDefinitionPreset, setSelectedDefinitionPreset] =
    useState<DefinitionPresetName>(DEFAULT_DEFINITION_PRESET);
  const [selectedRootNote, setSelectedRootNote] =
    useState<Note>(DEFAULT_ROOT_NOTE);
  const [selectedNoteDisplayMode, setSelectedNoteDisplayMode] =
    useState<NoteDisplayMode>(DEFAULT_NOTE_DISPLAY_MODE);

  const [selectedInstrumentTuning, setSelectedInstrumentTuning] = useState(
    DEFAULT_INSTRUMENT_TUNING_VALUE,
  );
  const resolvedInstrumentTuning = instrumentTuningGroups
    .flatMap((group) => group.tunings)
    .find((option) => option.value === selectedInstrumentTuning);

  if (!resolvedInstrumentTuning) {
    throw new Error('Expected at least one instrument tuning to be available.');
  }

  const definition = DEFINITIONS[selectedDefinitionPreset];

  // Start/end fret
  const [startFret, setStartFret] = useState(DEFAULT_START_FRET);
  const [endFret, setEndFret] = useState(DEFAULT_END_FRET);

  const startFretInput = useLenientInput<number>({
    value: startFret,
    setValue: setStartFret,
    deriveValue: (inputValue, currentValue) =>
      deriveFretValue(inputValue, currentValue, MIN_FRET, endFret),
    formatValue: (value) => String(value),
  });
  const endFretInput = useLenientInput<number>({
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
                {...startFretInput}
              />
            </label>
            <label className={styles.fieldGroup}>
              <span className={styles.fieldLabel}>End fret</span>
              <input
                className={styles.fretRangeInput}
                type="number"
                min={startFret}
                max={MAX_FRET}
                {...endFretInput}
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
              <option value="note">Note name</option>
              <option value="interval">Intervals</option>
              <option value="degree">Degrees</option>
              <option value="none">None</option>
            </select>
          </label>
        </div>

        <div className={`${styles.controlsRow} ${styles.controlsRowFill}`}>
          <label className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Definition preset</span>
            <select
              className={styles.selectorInput}
              value={selectedDefinitionPreset}
              onChange={(e) => {
                setSelectedDefinitionPreset(
                  e.target.value as DefinitionPresetName,
                );
              }}
            >
              {objectEntries(DEFINITIONS_GROUPED).map(
                ([groupName, presets]) => (
                  <optgroup
                    key={groupName}
                    label={groupName}
                  >
                    {objectKeys(presets).map((presetName) => (
                      <option
                        key={presetName}
                        value={presetName}
                      >
                        {presetName}
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
      </section>

      <section className={styles.fretboardSection}>
        <Scrollable>
          <FretboardImg
            className={styles.fretboardImg}
            definition={definition}
            tuning={resolvedInstrumentTuning.tuning}
            startFret={startFret}
            endFret={endFret}
            noteDisplayMode={selectedNoteDisplayMode}
            rootNote={selectedRootNote}
          />
        </Scrollable>
      </section>
    </Layout>
  );
}
