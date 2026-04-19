import { type PatternConfigEntryList } from '../../lib/pattern-config';
import { PATTERNS_GROUPED } from './patterns';

describe('pattern config integrity', () => {
  describe('numeric-only keys are forbidden (breaks object insertion order)', () => {
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

        if (entry.type !== 'pattern') {
          numericOnlyKeyPaths.push(
            ...collectNumericOnlyPatternKeyPaths(entry, path),
          );
        }
      }

      return numericOnlyKeyPaths;
    }

    test('PATTERNS_GROUPED passes integrity', () => {
      expect(collectNumericOnlyPatternKeyPaths(PATTERNS_GROUPED)).toEqual([]);
    });

    test('collectNumericOnlyPatternKeyPaths catches invalid keys in a synthetic tree', () => {
      const invalidPatternTree = {
        type: 'sublist',
        displayName: 'Pattern',
        entries: {
          scales: {
            type: 'optgroup',
            displayName: 'Scales',
            entries: {
              '123': {
                type: 'pattern',
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
  });

  describe('empty lists are forbidden (invariant for tree traversal)', () => {
    function collectEmptyListKeyPaths(
      list: PatternConfigEntryList,
      parentPath: readonly string[] = [],
    ): string[] {
      const emptyListKeyPaths: string[] = [];

      for (const [key, entry] of Object.entries(list.entries)) {
        const path = [...parentPath, key];

        if (
          entry.type !== 'pattern' &&
          Object.keys(entry.entries).length === 0
        ) {
          emptyListKeyPaths.push(path.join(' / '));
        }

        if (entry.type !== 'pattern') {
          emptyListKeyPaths.push(...collectEmptyListKeyPaths(entry, path));
        }
      }

      return emptyListKeyPaths;
    }

    test('PATTERNS_GROUPED passes integrity', () => {
      expect(collectEmptyListKeyPaths(PATTERNS_GROUPED)).toEqual([]);
    });

    test('collectEmptyListKeyPaths catches empty lists in a synthetic tree', () => {
      const invalidPatternTree = {
        type: 'sublist',
        displayName: 'Pattern',
        entries: {
          scales: {
            type: 'optgroup',
            displayName: 'Scales',
            entries: {
              major: {
                type: 'pattern',
                displayName: 'Major scale',
                rules: [],
              },
              minor: {
                type: 'pattern',
                displayName: 'Minor scale',
                rules: [],
              },
            },
          },
          emptyGroup: {
            type: 'optgroup',
            displayName: 'Empty group',
            entries: {},
          },
          validGroupWithEmptySublist: {
            type: 'optgroup',
            displayName: 'Valid group with empty sublist',
            entries: {
              emptySublist: {
                type: 'sublist',
                displayName: 'Empty list',
                entries: {},
              },
            },
          },
        },
      } as const satisfies PatternConfigEntryList;

      expect(collectEmptyListKeyPaths(invalidPatternTree)).toEqual([
        'emptyGroup',
        'validGroupWithEmptySublist / emptySublist',
      ]);
    });
  });
});
