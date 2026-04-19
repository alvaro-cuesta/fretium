import type { FretboardNoteColorName } from '../../../components/Fretboard/theme';
import type { PatternRule } from '../../../lib/pattern-engine';
import type { FifthInterval, SeventhInterval, ThirdInterval } from '../common';

type Make7TetradPositionOptions = {
  thirdInterval: ThirdInterval;
  fifthInterval: FifthInterval;
  seventhInterval: SeventhInterval;
  rootColor: FretboardNoteColorName;
  toneColor: FretboardNoteColorName;
};

export type Make7TetradPositionFn = (
  options: Make7TetradPositionOptions,
) => PatternRule[];

export function make7Tetrad_6432_RootPosition({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}
make7Tetrad_6432_RootPosition satisfies Make7TetradPositionFn;

export function make7Tetrad_6432_1stInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_6432_1stInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_6432_2ndInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: fifthInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_6432_2ndInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_6432_3rdInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_6432_3rdInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_5321_RootPosition({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: fifthInterval }, color: toneColor },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}
make7Tetrad_5321_RootPosition satisfies Make7TetradPositionFn;

export function make7Tetrad_5321_1stInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_5321_1stInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_5321_2ndInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_5321_2ndInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_5321_3rdInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_5321_3rdInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_6543_RootPosition({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
    { condition: { string: 6, interval: '1' }, color: rootColor },
  ] as const;
}
make7Tetrad_6543_RootPosition satisfies Make7TetradPositionFn;

export function make7Tetrad_6543_1stInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
    { condition: { string: 6, interval: thirdInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_6543_1stInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_6543_2ndInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
    { condition: { string: 6, interval: fifthInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_6543_2ndInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_6543_3rdInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
    { condition: { string: 6, interval: seventhInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_6543_3rdInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_5432_RootPosition({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
    { condition: { string: 5, interval: '1' }, color: rootColor },
  ] as const;
}
make7Tetrad_5432_RootPosition satisfies Make7TetradPositionFn;

export function make7Tetrad_5432_1stInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
    { condition: { string: 5, interval: thirdInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_5432_1stInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_5432_2ndInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
    { condition: { string: 5, interval: fifthInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_5432_2ndInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_5432_3rdInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
    { condition: { string: 5, interval: seventhInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_5432_3rdInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_4321_RootPosition({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: thirdInterval }, color: toneColor },
    { condition: { string: 2, interval: seventhInterval }, color: toneColor },
    { condition: { string: 3, interval: fifthInterval }, color: toneColor },
    { condition: { string: 4, interval: '1' }, color: rootColor },
  ] as const;
}
make7Tetrad_4321_RootPosition satisfies Make7TetradPositionFn;

export function make7Tetrad_4321_1stInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: fifthInterval }, color: toneColor },
    { condition: { string: 2, interval: '1' }, color: rootColor },
    { condition: { string: 3, interval: seventhInterval }, color: toneColor },
    { condition: { string: 4, interval: thirdInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_4321_1stInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_4321_2ndInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: seventhInterval }, color: toneColor },
    { condition: { string: 2, interval: thirdInterval }, color: toneColor },
    { condition: { string: 3, interval: '1' }, color: rootColor },
    { condition: { string: 4, interval: fifthInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_4321_2ndInversion satisfies Make7TetradPositionFn;

export function make7Tetrad_4321_3rdInversion({
  thirdInterval,
  fifthInterval,
  seventhInterval,
  rootColor,
  toneColor,
}: Make7TetradPositionOptions): PatternRule[] {
  return [
    { condition: { string: 1, interval: '1' }, color: rootColor },
    { condition: { string: 2, interval: fifthInterval }, color: toneColor },
    { condition: { string: 3, interval: thirdInterval }, color: toneColor },
    { condition: { string: 4, interval: seventhInterval }, color: toneColor },
  ] as const;
}
make7Tetrad_4321_3rdInversion satisfies Make7TetradPositionFn;
