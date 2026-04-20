import { PATTERNS_GROUPED } from '../../config/patterns/patterns';
import { getPatternConfigEntryAtPath } from '../../lib/pattern-config';
import { getPatternSelectOptions } from './pattern';

test('renders sublist children as single top-level options', () => {
  const topLevelOptions = getPatternSelectOptions(PATTERNS_GROUPED);

  expect(
    topLevelOptions.options.find(
      (option) => option.displayName === 'Heptatonic',
    ),
  ).toMatchObject({ value: 'heptatonic' });
});

test('flattens optgroup children and prefixes their values with the parent optgroup id', () => {
  const topLevelOptions = getPatternSelectOptions(PATTERNS_GROUPED);

  expect(
    topLevelOptions.groups.find((group) => group.displayName === 'Arpeggios'),
  ).toMatchObject({ id: 'arpeggios' });

  expect(
    topLevelOptions.groups
      .find((group) => group.displayName === 'Arpeggios')
      ?.options.map((option) => option.value),
  ).toEqual([
    'heptatonic/major',
    'heptatonic/minor',
    'heptatonic/melodic-minor',
    'heptatonic/harmonic-minor',
  ]);

  const arpeggioEntry = getPatternConfigEntryAtPath(PATTERNS_GROUPED, [
    'arpeggios/maj7',
  ]);

  if (arpeggioEntry === null || arpeggioEntry.type === 'pattern') {
    throw new Error('Expected Maj7 arpeggio entry to be a sublist.');
  }

  const arpeggioOptions = getPatternSelectOptions(arpeggioEntry);

  expect(arpeggioOptions.options.map((option) => option.value)).toEqual([
    'full',
  ]);
  expect(
    arpeggioOptions.groups
      .find((group) => group.displayName === 'CAGED positions')
      ?.options.map((option) => option.value),
  ).toContain('caged-positions/d');

  const chordEntry = getPatternConfigEntryAtPath(PATTERNS_GROUPED, [
    'chords-tetrads/maj7',
  ]);

  if (chordEntry === null || chordEntry.type === 'pattern') {
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
