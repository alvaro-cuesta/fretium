import type { JsonValue } from 'type-fest';
import { type NoteDisplayMode } from '../../lib/fretboard.ts';
import type { HistoryStateDeserializeResult } from '../../lib/history-state.ts';
import {
  DEFAULT_INSTRUMENT_TUNING_VALUE,
  deserializeInstrumentTuning,
  serializeInstrumentTuning,
  type InstrumentTuningOption,
} from './instrument-tuning.ts';

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

// Settings shared across every fretboard panel — instrument/tuning, note
// labels, and the visualization toggles. Per-panel state (pattern, root note,
// fret range) lives in FretboardConfig.
export type CommonConfig = {
  instrumentTuning: InstrumentTuningOption;
  noteDisplayMode: NoteDisplayMode;
  showBackgroundNeck: boolean;
  showFretLines: boolean;
  showFretMarkers: boolean;
  showFretLabels: boolean;
  showStringLabels: boolean;
  showDropShadows: boolean;
};

export const DEFAULT_COMMON_CONFIG: CommonConfig = {
  instrumentTuning: DEFAULT_INSTRUMENT_TUNING_VALUE,
  noteDisplayMode: 'note',
  showBackgroundNeck: true,
  showFretLines: true,
  showFretMarkers: true,
  showFretLabels: true,
  showStringLabels: true,
  showDropShadows: true,
};

function pickBoolean(
  raw: Record<string, unknown>,
  key: keyof CommonConfig,
  fallback: boolean,
): boolean {
  if (!(key in raw)) return fallback;
  const value = raw[key];
  return typeof value === 'boolean' ? value : fallback;
}

export function serializeCommonConfig(value: CommonConfig): JsonValue {
  return {
    instrumentTuning: serializeInstrumentTuning(value.instrumentTuning),
    noteDisplayMode: value.noteDisplayMode,
    showBackgroundNeck: value.showBackgroundNeck,
    showFretLines: value.showFretLines,
    showFretMarkers: value.showFretMarkers,
    showFretLabels: value.showFretLabels,
    showStringLabels: value.showStringLabels,
    showDropShadows: value.showDropShadows,
  };
}

/**
 * Lenient per-field deserializer: any missing or invalid field falls back to
 * its default. Keeps old saved state usable as the config shape evolves.
 */
export function deserializeCommonConfig(
  value: unknown,
): HistoryStateDeserializeResult<CommonConfig> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { type: 'error' };
  }

  const raw = value as Record<string, unknown>;
  const tuningResult = deserializeInstrumentTuning(raw['instrumentTuning']);

  return {
    type: 'success',
    value: {
      instrumentTuning:
        tuningResult.type === 'success'
          ? tuningResult.value
          : DEFAULT_COMMON_CONFIG.instrumentTuning,
      noteDisplayMode: isNoteDisplayMode(raw['noteDisplayMode'])
        ? raw['noteDisplayMode']
        : DEFAULT_COMMON_CONFIG.noteDisplayMode,
      showBackgroundNeck: pickBoolean(
        raw,
        'showBackgroundNeck',
        DEFAULT_COMMON_CONFIG.showBackgroundNeck,
      ),
      showFretLines: pickBoolean(
        raw,
        'showFretLines',
        DEFAULT_COMMON_CONFIG.showFretLines,
      ),
      showFretMarkers: pickBoolean(
        raw,
        'showFretMarkers',
        DEFAULT_COMMON_CONFIG.showFretMarkers,
      ),
      showFretLabels: pickBoolean(
        raw,
        'showFretLabels',
        DEFAULT_COMMON_CONFIG.showFretLabels,
      ),
      showStringLabels: pickBoolean(
        raw,
        'showStringLabels',
        DEFAULT_COMMON_CONFIG.showStringLabels,
      ),
      showDropShadows: pickBoolean(
        raw,
        'showDropShadows',
        DEFAULT_COMMON_CONFIG.showDropShadows,
      ),
    },
  };
}
