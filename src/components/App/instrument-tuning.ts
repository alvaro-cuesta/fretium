import { objectEntries } from '../../../lib/object.ts';
import { INSTRUMENTS } from '../../config/instruments.ts';
import type { HistoryStateDeserializeResult } from '../../lib/history-state.ts';

export type InstrumentTuningOption = `${string}::${string}`;

export const INSTRUMENT_TUNING_GROUPS = objectEntries(INSTRUMENTS).map(
  ([instrumentName, instrument]) => ({
    instrumentName,
    tunings: objectEntries(instrument.tunings).map(([tuningName, tuning]) => ({
      value: `${instrumentName}::${tuningName}` as InstrumentTuningOption,
      label: `${instrumentName} ${tuningName}`,
      tuning,
      stringCount: instrument.strings,
      instrumentName,
      tuningName,
    })),
  }),
);

const INSTRUMENT_TUNING_OPTIONS = INSTRUMENT_TUNING_GROUPS.flatMap(
  (group) => group.tunings,
);

export const INSTRUMENT_TUNING_BY_VALUE = new Map(
  INSTRUMENT_TUNING_OPTIONS.map((option) => [option.value, option]),
);

function isInstrumentTuningValue(
  value: unknown,
): value is InstrumentTuningOption {
  return (
    typeof value === 'string' &&
    INSTRUMENT_TUNING_BY_VALUE.has(value as InstrumentTuningOption)
  );
}

const DEFAULT_INSTRUMENT = 'Guitar' satisfies keyof typeof INSTRUMENTS;
const DEFAULT_INSTRUMENT_TUNING =
  'Standard' satisfies keyof (typeof INSTRUMENTS)[typeof DEFAULT_INSTRUMENT]['tunings'];

export const DEFAULT_INSTRUMENT_TUNING_VALUE =
  `${DEFAULT_INSTRUMENT}::${DEFAULT_INSTRUMENT_TUNING}` satisfies InstrumentTuningOption;

export function serializeInstrumentTuning(
  value: InstrumentTuningOption,
): InstrumentTuningOption {
  return value;
}

export function deserializeInstrumentTuning(
  value: unknown,
): HistoryStateDeserializeResult<InstrumentTuningOption> {
  return isInstrumentTuningValue(value)
    ? { type: 'success', value }
    : { type: 'error' };
}
