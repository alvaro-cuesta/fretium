import type { JsonValue } from 'type-fest';
import type { FretRangeInput } from '../../lib/fret-range.ts';
import type { HistoryStateDeserializeResult } from '../../lib/history-state.ts';
import { NOTES, type Note } from '../../lib/music.ts';
import {
  DEFAULT_FRET_RANGE,
  deserializeFretRange,
  serializeFretRange,
} from './fret-range.ts';
import {
  DEFAULT_PATTERN_PATH,
  deserializePatternPath,
  serializePatternPath,
  type GroupedPatternPath,
} from './pattern.ts';

function isRootNote(value: unknown): value is Note {
  return (
    typeof value === 'string' && (NOTES as readonly string[]).includes(value)
  );
}

// Per-panel fretboard state. Settings shared across all panels (instrument,
// note labels, visualization toggles) live in CommonConfig instead.
export type FretboardConfig = {
  pattern: GroupedPatternPath;
  rootNote: Note;
  fretRange: FretRangeInput;
};

export const DEFAULT_FRETBOARD_CONFIG: FretboardConfig = {
  pattern: DEFAULT_PATTERN_PATH,
  rootNote: 'C',
  fretRange: DEFAULT_FRET_RANGE,
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

function serializeFretboardConfig(value: FretboardConfig): JsonValue {
  return {
    pattern: serializePatternPath(value.pattern),
    rootNote: value.rootNote,
    fretRange: serializeFretRange(value.fretRange),
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
      pattern: pickField(
        raw,
        'pattern',
        deserializePatternPath,
        DEFAULT_FRETBOARD_CONFIG.pattern,
      ),
      rootNote: isRootNote(raw['rootNote'])
        ? raw['rootNote']
        : DEFAULT_FRETBOARD_CONFIG.rootNote,
      fretRange: pickField(
        raw,
        'fretRange',
        deserializeFretRange,
        DEFAULT_FRETBOARD_CONFIG.fretRange,
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
