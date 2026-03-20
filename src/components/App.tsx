import { useCallback, useState } from 'react';
import { objectEntries, objectKeys } from '../../lib/object.ts';
import { INSTRUMENTS } from '../lib/instrument.ts';
import { clamp } from '../lib/math.ts';
import styles from './App.module.scss';
import { type FretboardDefinition } from './Fretboard/Fretboard.tsx';
import { FretboardImg } from './FretboardImg.tsx';
import { Scrollable } from './Scrollable.tsx';

const definition: FretboardDefinition = [
  { condition: 'Note = G', color: '#18a999' },
  { condition: 'Note = C', color: '#f18805' },
  { condition: 'Note = D', color: '#d81e5b' },
  //{ condition: 'Note = E', color: '#f18805' },
  { condition: 'Note = F', color: '#f18805' },
  { condition: 'Note = A', color: '#f18805' },
  { condition: 'Note = B', color: '#f18805' },
];

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

const DEFAULT_START_FRET = 0;
const DEFAULT_END_FRET = 24;

const DEFAULT_INSTRUMENT = 'Guitar' satisfies keyof typeof INSTRUMENTS;
const DEFAULT_INSTRUMENT_TUNING =
  'Standard' satisfies keyof (typeof INSTRUMENTS)[typeof DEFAULT_INSTRUMENT]['tunings'];
const DEFAULT_INSTRUMENT_TUNING_VALUE = `${DEFAULT_INSTRUMENT}::${DEFAULT_INSTRUMENT_TUNING}`;

export function App() {
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
  const handleChangeStartFret = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStartFret = clamp(Number(e.target.value), MIN_FRET, endFret);
      setStartFret(newStartFret);
    },
    [endFret],
  );
  const handleChangeEndFret = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEndFret = clamp(Number(e.target.value), startFret, MAX_FRET);
      setEndFret(newEndFret);
    },
    [startFret],
  );

  return (
    <div className={styles.app}>
      <header>
        <h1>
          <a
            href={import.meta.env.PACKAGE_HOMEPAGE}
            className={styles.titleLink}
          >
            <img
              src="/favicon.svg"
              className={styles.titleLogo}
              aria-hidden="true"
            />
            <span className={styles.titleText}>
              {import.meta.env.PACKAGE_CONFIG_NAME}
            </span>
          </a>{' '}
          <small className={styles.subtitle}>
            {import.meta.env.PACKAGE_CONFIG_DESCRIPTION}
          </small>
        </h1>
      </header>
      <section className={styles.controlsSection}>
        <label className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Instrument</span>
          <select
            className={styles.selectorInput}
            value={resolvedInstrumentTuning.value}
            onChange={(e) => {
              setSelectedInstrumentTuning(e.target.value);
            }}
          >
            {objectEntries(INSTRUMENTS).map(([instrumentName, instrument]) => (
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
            ))}
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
              value={startFret}
              onChange={handleChangeStartFret}
            />
          </label>
          <label className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>End fret</span>
            <input
              className={styles.fretRangeInput}
              type="number"
              min={startFret}
              max={MAX_FRET}
              value={endFret}
              onChange={handleChangeEndFret}
            />
          </label>
        </div>
      </section>

      <section>
        <Scrollable>
          <FretboardImg
            className={styles.fretboardImg}
            definition={definition}
            tuning={resolvedInstrumentTuning.tuning}
            startFret={startFret}
            endFret={endFret}
          />
        </Scrollable>
      </section>

      <footer>
        <p>
          Made by{' '}
          <a
            href={import.meta.env.PACKAGE_AUTHOR.url}
            target="_blank"
            rel="noreferrer"
          >
            {import.meta.env.PACKAGE_AUTHOR.name}
          </a>
          . Source code on{' '}
          <a
            href={import.meta.env.PACKAGE_CONFIG_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
