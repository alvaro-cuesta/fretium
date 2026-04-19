import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { PATTERNS_GROUPED } from '../../config/patterns/patterns';
import { useHistoryState } from '../../hooks/useHistoryState';
import type { HistoryStateDeserializeResult } from '../../lib/history-state';
import {
  coercePatternPath,
  getPatternConfigEntryAtPath,
  getPatternConfigEntryPatternAtPath,
  getPatternDisplayNameAtPath,
  markPatternPathAsValidated,
  type PatternConfigEntry,
  type PatternConfigEntryList,
  type ValidatedPatternPath,
} from '../../lib/pattern-config';
import { HISTORY_STATE_KEYS } from './history';

type GroupedPatternPath = ValidatedPatternPath<typeof PATTERNS_GROUPED>;

const DEFAULT_PATTERN_PATH = coercePatternPath(PATTERNS_GROUPED, []);

const GROUPED_PATTERN_VALUE_SEPARATOR = '/';

function getGroupedPatternValue(groupId: string, optionId: string): string {
  return `${groupId}${GROUPED_PATTERN_VALUE_SEPARATOR}${optionId}`;
}

type PatternSelectOption = {
  value: string;
  displayName: string;
  entry: PatternConfigEntry;
};

type PatternSelectGroup = {
  id: string;
  displayName: string;
  options: PatternSelectOption[];
};

export function getPatternSelectOptions(list: PatternConfigEntryList): {
  options: PatternSelectOption[];
  groups: PatternSelectGroup[];
} {
  const options: PatternSelectOption[] = [];
  const groups: PatternSelectGroup[] = [];

  for (const [id, entry] of Object.entries(list.entries)) {
    const option = {
      value: id,
      displayName: entry.displayName,
      entry,
    } satisfies PatternSelectOption;

    if (entry.type === 'pattern') {
      options.push(option);
      continue;
    }

    const groupOptions = Object.entries(entry.entries).flatMap(
      ([groupId, groupEntry]) => {
        return {
          value: getGroupedPatternValue(id, groupId),
          displayName: groupEntry.displayName,
          entry: groupEntry,
        } satisfies PatternSelectOption;
      },
    );

    groups.push({
      id,
      displayName: entry.displayName,
      options: groupOptions,
    });
  }

  return { options, groups };
}

type PatternSelectDescriptor = {
  ariaLabel: string;
  value: string;
  options: ReturnType<typeof getPatternSelectOptions>;
};

export function getPatternSelectDescriptors(
  path: readonly string[],
): PatternSelectDescriptor[] {
  const descriptors: PatternSelectDescriptor[] = [];
  let currentList: PatternConfigEntryList = PATTERNS_GROUPED;

  for (const [index, segment] of path.entries()) {
    if (currentList.type !== 'sublist') {
      throw new Error('Pattern selectors can only be rendered from sub-lists.');
    }

    descriptors.push({
      ariaLabel:
        index === 0
          ? 'Pattern'
          : `${getPatternDisplayNameAtPath(PATTERNS_GROUPED, markPatternPathAsValidated(PATTERNS_GROUPED, path.slice(0, index))) ?? 'Pattern'} Variant`,
      value: segment,
      options: getPatternSelectOptions(currentList),
    });

    const entry = getPatternConfigEntryAtPath(currentList, [segment]);

    if (entry === null || entry.type === 'pattern') {
      break;
    }

    currentList = entry;
  }

  return descriptors;
}

function serializePatternPath(value: GroupedPatternPath): GroupedPatternPath {
  return value;
}

function deserializePatternPath(
  value: unknown,
): HistoryStateDeserializeResult<GroupedPatternPath> {
  if (
    !Array.isArray(value) ||
    !value.every((segment) => typeof segment === 'string')
  ) {
    return { type: 'error' };
  }

  return {
    type: 'success',
    value: coercePatternPath(PATTERNS_GROUPED, value),
  };
}

export function usePattern() {
  const [storedPatternPath, setStoredPatternPath] = useHistoryState(
    HISTORY_STATE_KEYS.selectedPattern,
    DEFAULT_PATTERN_PATH,
    {
      serialize: serializePatternPath,
      deserialize: deserializePatternPath,
    },
  );

  const setPatternPath: Dispatch<SetStateAction<GroupedPatternPath>> =
    useCallback(
      (value) => {
        setStoredPatternPath((currentValue) => {
          const nextValue =
            typeof value === 'function' ? value(currentValue) : value;
          return coercePatternPath(PATTERNS_GROUPED, nextValue);
        });
      },
      [setStoredPatternPath],
    );

  const patternPath = coercePatternPath(PATTERNS_GROUPED, storedPatternPath);
  const patternConfigEntryPattern = getPatternConfigEntryPatternAtPath(
    PATTERNS_GROUPED,
    patternPath,
  );

  if (!patternConfigEntryPattern) {
    throw new Error(`Invalid pattern path: ${patternPath.join(' / ')}`);
  }

  return {
    patternPath,
    setPatternPath,
    patternConfigEntryPattern,
  } as const;
}
