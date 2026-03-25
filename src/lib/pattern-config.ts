import type { Pattern } from './pattern-engine';

export type PatternPath = string[];

type PatternConfigEntryBase = {
  displayName: string;
};

export type PatternConfigEntryPattern = PatternConfigEntryBase & Pattern;

export type PatternConfigEntryListOptgroup = PatternConfigEntryBase & {
  type: 'optgroup';
  entries: Record<
    string,
    // optgroups cannot have another optgroup as a direct descendant
    Exclude<PatternConfigEntry, PatternConfigEntryListOptgroup>
  >;
};

export type PatternConfigEntryListSublist = PatternConfigEntryBase & {
  type: 'sublist';
  entries: Record<string, PatternConfigEntry>;
};

export type PatternConfigEntry =
  | PatternConfigEntryPattern
  | PatternConfigEntryList;

export type PatternConfigEntryList =
  | PatternConfigEntryListOptgroup
  | PatternConfigEntryListSublist;

const GROUPED_PATTERN_VALUE_SEPARATOR = '/';

function getGroupedPatternValue(groupId: string, optionId: string): string {
  return `${groupId}${GROUPED_PATTERN_VALUE_SEPARATOR}${optionId}`;
}

export function isPatternConfigEntryPattern(
  entry: PatternConfigEntry,
): entry is PatternConfigEntryPattern {
  return 'rules' in entry;
}

function resolvePatternPathSegment(
  list: PatternConfigEntryList,
  value: string,
): { value: string; displayName: string; entry: PatternConfigEntry } | null {
  for (const [id, entry] of Object.entries(list.entries)) {
    if (isPatternConfigEntryPattern(entry)) {
      if (id === value) {
        return {
          value: id,
          displayName: entry.displayName,
          entry,
        };
      }

      continue;
    }

    for (const [groupId, groupEntry] of Object.entries(entry.entries)) {
      const groupedValue = getGroupedPatternValue(id, groupId);

      if (groupedValue === value) {
        return {
          value: groupedValue,
          displayName: groupEntry.displayName,
          entry: groupEntry,
        };
      }
    }
  }

  return null;
}

function getFirstPatternOption(
  list: PatternConfigEntryList,
): { value: string; displayName: string; entry: PatternConfigEntry } | null {
  for (const [id, entry] of Object.entries(list.entries)) {
    if (isPatternConfigEntryPattern(entry)) {
      return {
        value: id,
        displayName: entry.displayName,
        entry,
      };
    }

    const firstGroupEntry = Object.entries(entry.entries)[0];

    if (!firstGroupEntry) {
      continue;
    }

    const [groupId, groupEntry] = firstGroupEntry;

    return {
      value: getGroupedPatternValue(id, groupId),
      displayName: groupEntry.displayName,
      entry: groupEntry,
    };
  }

  return null;
}

export function getPatternConfigEntryAtPath(
  list: PatternConfigEntryList,
  path: readonly string[],
): PatternConfigEntry | null {
  let currentList = list;

  for (const [index, segment] of path.entries()) {
    const option = resolvePatternPathSegment(currentList, segment);
    if (option === null) {
      return null;
    }

    const entry = option.entry;

    if (index === path.length - 1) {
      return entry;
    }

    if (isPatternConfigEntryPattern(entry)) {
      return null;
    }

    currentList = entry;
  }

  return currentList;
}

export function getPatternConfigEntryPatternAtPath(
  list: PatternConfigEntryList,
  path: readonly string[],
): PatternConfigEntryPattern | null {
  const entry = getPatternConfigEntryAtPath(list, path);
  return entry !== null && isPatternConfigEntryPattern(entry) ? entry : null;
}

export function getPatternDisplayNameAtPath(
  list: PatternConfigEntryList,
  path: readonly string[],
): string | null {
  let currentList = list;

  for (const [index, segment] of path.entries()) {
    const option = resolvePatternPathSegment(currentList, segment);

    if (option === null) {
      return null;
    }

    if (index === path.length - 1) {
      return option.displayName;
    }

    if (isPatternConfigEntryPattern(option.entry)) {
      return null;
    }

    currentList = option.entry;
  }

  return null;
}

export function coercePatternPath(
  list: PatternConfigEntryList,
  path: readonly string[],
): PatternPath | null {
  const resolvedPath: string[] = [];
  let currentList = list;

  for (const segment of path) {
    const option = resolvePatternPathSegment(currentList, segment);
    if (option === null) {
      break;
    }

    resolvedPath.push(option.value);

    const entry = option.entry;

    if (isPatternConfigEntryPattern(entry)) {
      return resolvedPath;
    }

    currentList = entry;
  }

  let nextOption = getFirstPatternOption(currentList);

  while (nextOption !== null) {
    const currentOption = nextOption;

    resolvedPath.push(currentOption.value);

    if (isPatternConfigEntryPattern(currentOption.entry)) {
      return resolvedPath;
    }

    currentList = currentOption.entry;
    nextOption = getFirstPatternOption(currentList);
  }

  return resolvedPath.length === 0 ? null : resolvedPath;
}
