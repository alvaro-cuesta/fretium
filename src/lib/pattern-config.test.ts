import { PATTERNS_GROUPED } from '../config/patterns/patterns';
import {
  coercePatternPath,
  getPatternConfigEntryPatternAtPath,
  markPatternPathAsValidated,
} from './pattern-config';

test('coerces canonical grouped ids and completes partial paths', () => {
  expect(
    coercePatternPath(PATTERNS_GROUPED, [
      'arpeggios/maj7',
      'caged-positions/d',
      'base',
    ]),
  ).toEqual(['arpeggios/maj7', 'caged-positions/d', 'base']);

  expect(
    coercePatternPath(PATTERNS_GROUPED, [
      'chords-tetrads/maj7',
      'drop3/_6432',
      'root',
    ]),
  ).toEqual(['chords-tetrads/maj7', 'drop3/_6432', 'root']);

  expect(coercePatternPath(PATTERNS_GROUPED, ['arpeggios/maj7'])).toEqual([
    'arpeggios/maj7',
    'full',
  ]);
  expect(coercePatternPath(PATTERNS_GROUPED, ['chords-tetrads/maj7'])).toEqual([
    'chords-tetrads/maj7',
    'drop3/_6432',
    'all',
  ]);
});

test('resolves grouped paths to concrete patterns', () => {
  expect(
    getPatternConfigEntryPatternAtPath(
      PATTERNS_GROUPED,
      markPatternPathAsValidated(PATTERNS_GROUPED, [
        'arpeggios/maj7',
        'caged-positions/d',
        'base',
      ]),
    ),
  ).not.toBeNull();

  expect(
    getPatternConfigEntryPatternAtPath(
      PATTERNS_GROUPED,
      markPatternPathAsValidated(PATTERNS_GROUPED, [
        'chords-tetrads/maj7',
        'drop2/_4321',
        'root',
      ]),
    ),
  ).not.toBeNull();
});
