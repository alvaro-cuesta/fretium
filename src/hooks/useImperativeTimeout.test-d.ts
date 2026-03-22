import { expectTypeOf, test } from 'vitest';
import { useImperativeTimeout } from './useImperativeTimeout';

type TimeoutCleanup = () => void;
type TimeoutCallback = Parameters<
  ReturnType<typeof useImperativeTimeout>['schedule']
>[0];

test('useImperativeTimeout schedule callback type', () => {
  expectTypeOf<TimeoutCallback>().toEqualTypeOf<
    (() => void) | (() => TimeoutCleanup)
  >();
});
