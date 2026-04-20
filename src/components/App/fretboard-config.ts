import type { JsonValue } from 'type-fest';
import type { FretRangeInput } from '../../lib/fret-range.ts';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import type { HistoryStateDeserializeResult } from '../../lib/history-state.ts';
import { NOTES, type Note } from '../../lib/music.ts';
import {
  DEFAULT_FRET_RANGE,
  deserializeFretRange,
  serializeFretRange,
} from './fret-range.ts';
import {
  DEFAULT_INSTRUMENT_TUNING_VALUE,
  deserializeInstrumentTuning,
  serializeInstrumentTuning,
  type InstrumentTuningOption,
} from './instrument-tuning.ts';
import {
  DEFAULT_PATTERN_PATH,
  deserializePatternPath,
  serializePatternPath,
  type GroupedPatternPath,
} from './pattern.ts';

// Root note
function isRootNote(value: unknown): value is Note {
  return (
    typeof value === 'string' && (NOTES as readonly string[]).includes(value)
  );
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

export type FretboardConfig = {
  instrumentTuning: InstrumentTuningOption;
  pattern: GroupedPatternPath;
  rootNote: Note;
  noteDisplayMode: NoteDisplayMode;
  fretRange: FretRangeInput;
  showBackgroundNeck: boolean;
  showStrings: boolean;
  showFretLines: boolean;
  showFretMarkers: boolean;
  showFretLabels: boolean;
  showStringLabels: boolean;
  showDropShadows: boolean;
};

export const DEFAULT_FRETBOARD_CONFIG: FretboardConfig = {
  instrumentTuning: DEFAULT_INSTRUMENT_TUNING_VALUE,
  pattern: DEFAULT_PATTERN_PATH,
  rootNote: 'C',
  noteDisplayMode: 'note',
  fretRange: DEFAULT_FRET_RANGE,
  showBackgroundNeck: true,
  showStrings: true,
  showFretLines: true,
  showFretMarkers: true,
  showFretLabels: true,
  showStringLabels: true,
  showDropShadows: true,
};

function pickField<TValue>(
  raw: Record<string, unknown>,
  key: keyof FretboardConfig,
  deserialize: (value: unknown) => HistoryStateDeserializeResult<TValue>,
  fallback: TValue,
): TValue {
  if (!(key in raw)) return fallback;
  const result = deserialize(raw[key]);
  return result.type === 'success' ? result.value : fallback;
}

function pickBoolean(
  raw: Record<string, unknown>,
  key: keyof FretboardConfig,
  fallback: boolean,
): boolean {
  if (!(key in raw)) return fallback;
  const value = raw[key];
  return typeof value === 'boolean' ? value : fallback;
}

function serializeFretboardConfig(value: FretboardConfig): JsonValue {
  return {
    instrumentTuning: serializeInstrumentTuning(value.instrumentTuning),
    pattern: serializePatternPath(value.pattern),
    rootNote: value.rootNote,
    noteDisplayMode: value.noteDisplayMode,
    fretRange: serializeFretRange(value.fretRange),
    showBackgroundNeck: value.showBackgroundNeck,
    showStrings: value.showStrings,
    showFretLines: value.showFretLines,
    showFretMarkers: value.showFretMarkers,
    showFretLabels: value.showFretLabels,
    showStringLabels: value.showStringLabels,
    showDropShadows: value.showDropShadows,
  };
}

/**
 * Lenient per-field deserializer: any missing or invalid field falls back to its
 * default. This lets us keep old saved state usable as the config shape evolves.
 */
function deserializeFretboardConfig(
  value: unknown,
): HistoryStateDeserializeResult<FretboardConfig> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { type: 'error' };
  }

  const raw = value as Record<string, unknown>;

  return {
    type: 'success',
    value: {
      instrumentTuning: pickField(
        raw,
        'instrumentTuning',
        deserializeInstrumentTuning,
        DEFAULT_FRETBOARD_CONFIG.instrumentTuning,
      ),
      pattern: pickField(
        raw,
        'pattern',
        deserializePatternPath,
        DEFAULT_FRETBOARD_CONFIG.pattern,
      ),
      rootNote: isRootNote(raw['rootNote'])
        ? raw['rootNote']
        : DEFAULT_FRETBOARD_CONFIG.rootNote,
      noteDisplayMode: isNoteDisplayMode(raw['noteDisplayMode'])
        ? raw['noteDisplayMode']
        : DEFAULT_FRETBOARD_CONFIG.noteDisplayMode,
      fretRange: pickField(
        raw,
        'fretRange',
        deserializeFretRange,
        DEFAULT_FRETBOARD_CONFIG.fretRange,
      ),
      showBackgroundNeck: pickBoolean(
        raw,
        'showBackgroundNeck',
        DEFAULT_FRETBOARD_CONFIG.showBackgroundNeck,
      ),
      showStrings: pickBoolean(
        raw,
        'showStrings',
        DEFAULT_FRETBOARD_CONFIG.showStrings,
      ),
      showFretLines: pickBoolean(
        raw,
        'showFretLines',
        DEFAULT_FRETBOARD_CONFIG.showFretLines,
      ),
      showFretMarkers: pickBoolean(
        raw,
        'showFretMarkers',
        DEFAULT_FRETBOARD_CONFIG.showFretMarkers,
      ),
      showFretLabels: pickBoolean(
        raw,
        'showFretLabels',
        DEFAULT_FRETBOARD_CONFIG.showFretLabels,
      ),
      showStringLabels: pickBoolean(
        raw,
        'showStringLabels',
        DEFAULT_FRETBOARD_CONFIG.showStringLabels,
      ),
      showDropShadows: pickBoolean(
        raw,
        'showDropShadows',
        DEFAULT_FRETBOARD_CONFIG.showDropShadows,
      ),
    },
  };
}

export function serializeFretboardConfigArray(
  value: readonly FretboardConfig[],
): JsonValue {
  return value.map(serializeFretboardConfig);
}

export function deserializeFretboardConfigArray(
  value: unknown,
): HistoryStateDeserializeResult<FretboardConfig[]> {
  if (!Array.isArray(value)) {
    return { type: 'error' };
  }

  const configs: FretboardConfig[] = [];
  for (const entry of value) {
    const result = deserializeFretboardConfig(entry);
    // Skip entries that aren't even objects; lenient per-field handles the rest
    if (result.type === 'success') {
      configs.push(result.value);
    }
  }

  if (configs.length === 0) {
    return { type: 'error' };
  }

  return { type: 'success', value: configs };
}
