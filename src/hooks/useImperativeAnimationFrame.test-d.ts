import { expectTypeOf, test } from 'vitest';
import { useImperativeAnimationFrame } from './useImperativeAnimationFrame';

type AnimationFrameCleanup = () => void;
type AnimationFrameCallback = Parameters<
  ReturnType<typeof useImperativeAnimationFrame>['schedule']
>[0];

test('useImperativeAnimationFrame schedule callback type', () => {
  expectTypeOf<AnimationFrameCallback>().toEqualTypeOf<
    (() => void) | (() => AnimationFrameCleanup)
  >();
});
