import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { clamp } from '../lib/math';
import { useLenientInput } from './useLenientInput';

const INTEGER_INPUT_PATTERN = /^\d+$/;

type HookProps = {
  initialValue: number;
  min: number;
  max: number;
};

function deriveFretValue(
  inputValue: string,
  currentValue: number,
  min: number,
  max: number,
) {
  const trimmedValue = inputValue.trim();
  if (trimmedValue === '') return currentValue;

  if (!INTEGER_INPUT_PATTERN.test(trimmedValue)) return currentValue;

  const parsedValue = Number(trimmedValue);
  if (Number.isNaN(parsedValue)) return currentValue;

  return clamp(parsedValue, min, max);
}

function useTestHook({ initialValue, min, max }: HookProps) {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const input = useLenientInput<number>({
    value: currentValue,
    setValue: setCurrentValue,
    deriveValue: (inputValue, currentValue) =>
      deriveFretValue(inputValue, currentValue, min, max),
    formatValue: (nextValue) => String(nextValue),
  });

  return {
    currentValue,
    input,
  };
}

function changeValue(value: string) {
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

function blurInput() {
  return {} as React.FocusEvent<HTMLInputElement>;
}

test('allows clearing an input without forcing a value until blur', () => {
  const { result } = renderHook(useTestHook, {
    initialProps: {
      initialValue: 14,
      min: 0,
      max: 48,
    },
  });

  act(() => {
    result.current.input.onChange(changeValue(''));
  });

  expect(result.current.input.value).toBe('');
  expect(result.current.currentValue).toBe(14);

  act(() => {
    result.current.input.onBlur(blurInput());
  });

  expect(result.current.input.value).toBe('14');
  expect(result.current.currentValue).toBe(14);
});

test('applies valid changes immediately while preserving typed formatting until blur', () => {
  const { result } = renderHook(useTestHook, {
    initialProps: {
      initialValue: 14,
      min: 0,
      max: 48,
    },
  });

  act(() => {
    result.current.input.onChange(changeValue('034'));
  });

  expect(result.current.input.value).toBe('034');
  expect(result.current.currentValue).toBe(34);

  act(() => {
    result.current.input.onBlur(blurInput());
  });

  expect(result.current.input.value).toBe('34');
  expect(result.current.currentValue).toBe(34);
});

test('lets callers define the actual value immediately while keeping the typed text visible', () => {
  const { result } = renderHook(useTestHook, {
    initialProps: {
      initialValue: 0,
      min: 0,
      max: 14,
    },
  });

  act(() => {
    result.current.input.onChange(changeValue('99'));
  });

  expect(result.current.input.value).toBe('99');
  expect(result.current.currentValue).toBe(14);

  act(() => {
    result.current.input.onBlur(blurInput());
  });

  expect(result.current.input.value).toBe('14');
  expect(result.current.currentValue).toBe(14);
});

test('keeps invalid text editable until blur before applying parse fallback', () => {
  const { result } = renderHook(useTestHook, {
    initialProps: {
      initialValue: 6,
      min: 0,
      max: 14,
    },
  });

  act(() => {
    result.current.input.onChange(changeValue('abc'));
  });

  expect(result.current.input.value).toBe('abc');
  expect(result.current.currentValue).toBe(6);

  act(() => {
    result.current.input.onBlur(blurInput());
  });

  expect(result.current.input.value).toBe('6');
  expect(result.current.currentValue).toBe(6);
});

test('treats a distinct but equal object value as an external resync', () => {
  const stableValue = { fret: 6 };
  const setValue = vi.fn();
  const { result, rerender } = renderHook(
    ({ value }) =>
      useLenientInput({
        value,
        setValue,
        deriveValue: (_inputValue: string, currentValue: { fret: number }) =>
          currentValue,
        formatValue: (nextValue: { fret: number }) => String(nextValue.fret),
      }),
    {
      initialProps: {
        value: stableValue,
      },
    },
  );

  act(() => {
    result.current.onChange(changeValue('abc'));
  });

  expect(result.current.value).toBe('abc');

  rerender({ value: stableValue });

  expect(result.current.value).toBe('abc');

  rerender({ value: { fret: 6 } });

  expect(result.current.value).toBe('6');
});
