import { PATTERNS, type PatternName } from '../../config/patterns';
import { useHistoryState } from '../../hooks/useHistoryState';
import type { HistoryStateDeserializeResult } from '../../lib/history-state';
import { HISTORY_STATE_KEYS } from './history';

const DEFAULT_PATTERN = 'Major scale' satisfies PatternName;

function isPatternName(value: unknown): value is PatternName {
  return typeof value === 'string' && Object.hasOwn(PATTERNS, value);
}

function serializePatternName(value: PatternName): PatternName {
  return value;
}

function deserializePatternName(
  value: unknown,
): HistoryStateDeserializeResult<PatternName> {
  return isPatternName(value) ? { type: 'success', value } : { type: 'error' };
}

export function usePattern() {
  const [patternName, setPatternName] = useHistoryState<PatternName>(
    HISTORY_STATE_KEYS.selectedPattern,
    DEFAULT_PATTERN,
    {
      serialize: serializePatternName,
      deserialize: deserializePatternName,
    },
  );

  const pattern = PATTERNS[patternName];

  return {
    patternName,
    setPatternName,
    pattern,
  } as const;
}
