import type { Tagged } from 'type-fest';
import type { Pattern } from './pattern-engine';

export type PatternPath = readonly string[];

export type ValidatedPatternPath<TList extends PatternConfigEntryList> = Tagged<
  PatternPath,
  `ValidatedPatternPath<${TList['displayName']}>`,
  TList
>;

type PatternConfigEntryBase = {
  displayName: string;
};

export type PatternConfigEntryPattern = PatternConfigEntryBase & {
  type: 'pattern';
} & Pattern;

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

/**
 * **WARNING**: This function is a type-level assertion and does not perform any runtime validation.
 * It should only be used when the caller can guarantee that the provided `path` is valid according
 * to the pattern config entry list structure.
 *
 * @param _list The pattern config entry list the path is claimed to be valid for. Only used for
 *   type inference; not read at runtime.
 * @param path The pattern path to mark as validated.
 * @returns The same pattern path, but with its type asserted as `ValidatedPatternPath`.
 */
export function markPatternPathAsValidated<
  TList extends PatternConfigEntryList,
>(_list: TList, path: PatternPath): ValidatedPatternPath<TList> {
  return path as unknown as ValidatedPatternPath<TList>;
}

const GROUPED_PATTERN_VALUE_SEPARATOR = '/';

function getGroupedPatternValue(groupId: string, optionId: string): string {
  return `${groupId}${GROUPED_PATTERN_VALUE_SEPARATOR}${optionId}`;
}

function resolvePatternPathSegment(
  list: PatternConfigEntryList,
  value: string,
): { value: string; displayName: string; entry: PatternConfigEntry } | null {
  for (const [id, entry] of Object.entries(list.entries)) {
    if (entry.type === 'pattern') {
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

    if (entry.type === 'pattern') {
      return null;
    }

    currentList = entry;
  }

  return currentList;
}

export function getPatternConfigEntryPatternAtPath<
  TList extends PatternConfigEntryList,
>(
  list: TList,
  path: ValidatedPatternPath<TList>,
): PatternConfigEntryPattern | null {
  const entry = getPatternConfigEntryAtPath(list, path);
  return entry !== null && entry.type === 'pattern' ? entry : null;
}

export function getPatternDisplayNameAtPath<
  TList extends PatternConfigEntryList,
>(list: TList, path: ValidatedPatternPath<TList>): string | null {
  let currentList: PatternConfigEntryList = list;

  for (const [index, segment] of path.entries()) {
    const option = resolvePatternPathSegment(currentList, segment);

    if (option === null) {
      return null;
    }

    if (index === path.length - 1) {
      return option.displayName;
    }

    if (option.entry.type === 'pattern') {
      return null;
    }

    currentList = option.entry;
  }

  return null;
}

/**
 * Coerces a pattern path that may be incomplete or contain invalid segments into a valid pattern path by:
 *
 * 1. Traversing as far down the path as possible until an invalid segment is encountered.
 * 2. Filling in any missing segments with the first available option at each level.
 *
 * @param list The pattern config entry list to resolve the path against.
 * @param path The pattern path to coerce, which may be incomplete or contain invalid segments.
 * @returns A valid pattern path.
 * @throws If the pattern config entry list contains no pattern entries at all.
 */
export function coercePatternPath<TList extends PatternConfigEntryList>(
  list: TList,
  path: PatternPath,
): ValidatedPatternPath<TList> {
  const resolvedPath: string[] = [];
  let currentList: PatternConfigEntryList = list;

  // Traverse as far down the path as possible until an invalid segment is encountered
  for (const segment of path) {
    const option = resolvePatternPathSegment(currentList, segment);
    if (!option) {
      break;
    }

    resolvedPath.push(option.value);

    const entry = option.entry;

    // If the path resolves to a pattern entry at any point, return the resolved path up to that
    // point since patterns cannot have descendants and any further segments would be invalid
    if (entry.type === 'pattern') {
      return markPatternPathAsValidated(list, resolvedPath);
    }

    currentList = entry;
  }

  // Fill in any missing segments with the first available option at each level
  let nextStep = getFirstPathStep(currentList);
  while (nextStep !== null) {
    resolvedPath.push(nextStep.value);

    // Reached leaf
    if (nextStep.entry.type === 'pattern') {
      return markPatternPathAsValidated(list, resolvedPath);
    }

    currentList = nextStep.entry;
    nextStep = getFirstPathStep(currentList);
  }

  if (resolvedPath.length === 0) {
    throw new Error('`list` must contain at least one entry.');
  }

  return markPatternPathAsValidated(list, resolvedPath);
}

// Optgroups flatten into the parent path segment (e.g. `scales/major`), while patterns and
// sublists each occupy their own segment. This helper returns the first reachable path step from
// the given list, mirroring how `resolvePatternPathSegment` matches segments.
function getFirstPathStep(
  list: PatternConfigEntryList,
): { value: string; entry: PatternConfigEntry } | null {
  for (const [id, entry] of Object.entries(list.entries)) {
    if (entry.type === 'optgroup') {
      const firstGroupEntry = Object.entries(entry.entries)[0];
      if (!firstGroupEntry) continue;
      const [groupId, groupEntry] = firstGroupEntry;
      return {
        value: getGroupedPatternValue(id, groupId),
        entry: groupEntry,
      };
    }
    return { value: id, entry };
  }
  return null;
}
