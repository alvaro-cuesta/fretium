import { PATTERNS_GROUPED } from '../../config/patterns/patterns';
import {
  getPatternConfigEntryAtPath,
  isPatternConfigEntryPattern,
} from '../../lib/pattern-config';
import { getPatternSelectOptions } from './pattern';

test('prefixes optgroup child values with their parent optgroup id', () => {
  const topLevelOptions = getPatternSelectOptions(PATTERNS_GROUPED);

  expect(
    topLevelOptions.groups.find((group) => group.displayName === 'Scales'),
  ).toMatchObject({ id: 'scales' });

  expect(
    topLevelOptions.groups
      .find((group) => group.displayName === 'Scales')
      ?.options.map((option) => option.value),
  ).toEqual(['scales/major', 'scales/minor']);

  const arpeggioEntry = getPatternConfigEntryAtPath(PATTERNS_GROUPED, [
    'arpeggios/maj7',
  ]);

  if (arpeggioEntry === null || isPatternConfigEntryPattern(arpeggioEntry)) {
    throw new Error('Expected Maj7 arpeggio entry to be a sublist.');
  }

  const arpeggioOptions = getPatternSelectOptions(arpeggioEntry);

  expect(arpeggioOptions.options.map((option) => option.value)).toEqual([
    'full',
  ]);
  expect(
    arpeggioOptions.groups
      .find((group) => group.displayName === 'Positions')
      ?.options.map((option) => option.value),
  ).toContain('positions/d');

  const chordEntry = getPatternConfigEntryAtPath(PATTERNS_GROUPED, [
    'chords-tetrads/maj7',
  ]);

  if (chordEntry === null || isPatternConfigEntryPattern(chordEntry)) {
    throw new Error('Expected Maj7 chord entry to be a sublist.');
  }

  const chordOptions = getPatternSelectOptions(chordEntry);

  expect(chordOptions.options).toEqual([]);
  expect(
    chordOptions.groups
      .find((group) => group.displayName === 'Drop 3')
      ?.options.map((option) => option.value),
  ).toContain('drop3/_6432');
  expect(
    chordOptions.groups
      .find((group) => group.displayName === 'Drop 2')
      ?.options.map((option) => option.value),
  ).toContain('drop2/_4321');
});
