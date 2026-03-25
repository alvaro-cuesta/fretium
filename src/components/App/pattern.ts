import { PATTERNS, type PatternName } from '../../config/patterns';
import { useHistoryState } from '../../hooks/useHistoryState';
import { HISTORY_STATE_KEYS } from './history';

const DEFAULT_PATTERN = 'Major scale' satisfies PatternName;

function isPatternName(value: unknown): value is PatternName {
  return typeof value === 'string' && Object.hasOwn(PATTERNS, value);
}

export function usePattern() {
  const [patternName, setPatternName] = useHistoryState<PatternName>(
    HISTORY_STATE_KEYS.selectedPattern,
    DEFAULT_PATTERN,
    { isValid: isPatternName },
  );

  const pattern = PATTERNS[patternName];

  return {
    patternName,
    setPatternName,
    pattern,
  } as const;
}
