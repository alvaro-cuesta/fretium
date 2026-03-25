import {
  isPatternConfigEntryPattern,
  type PatternConfigEntryList,
} from '../../lib/pattern-config';
import { PATTERNS_GROUPED } from './patterns';

function collectNumericOnlyPatternKeyPaths(
  list: PatternConfigEntryList,
  parentPath: readonly string[] = [],
): string[] {
  const numericOnlyKeyPaths: string[] = [];

  for (const [key, entry] of Object.entries(list.entries)) {
    const path = [...parentPath, key];

    if (/^\d+$/.test(key)) {
      numericOnlyKeyPaths.push(path.join(' / '));
    }

    if (!isPatternConfigEntryPattern(entry)) {
      numericOnlyKeyPaths.push(
        ...collectNumericOnlyPatternKeyPaths(entry, path),
      );
    }
  }

  return numericOnlyKeyPaths;
}

test('has no numeric-only keys anywhere in the pattern tree', () => {
  expect(collectNumericOnlyPatternKeyPaths(PATTERNS_GROUPED)).toEqual([]);
});

test('the numeric-only key guard catches invalid keys in a synthetic tree', () => {
  const invalidPatternTree = {
    type: 'sublist',
    displayName: 'Pattern',
    entries: {
      scales: {
        type: 'optgroup',
        displayName: 'Scales',
        entries: {
          '123': {
            displayName: 'Bad key',
            rules: [],
          },
        },
      },
    },
  } as const satisfies PatternConfigEntryList;

  expect(collectNumericOnlyPatternKeyPaths(invalidPatternTree)).toEqual([
    'scales / 123',
  ]);
});
