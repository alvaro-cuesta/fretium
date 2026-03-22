import { useCallback, useMemo, useState } from 'react';

type UseLenientInputOptions<TValue> = {
  value: TValue;
  setValue: (nextValue: TValue) => void;
  deriveValue: (inputValue: string, currentValue: TValue) => TValue;
  formatValue: (value: TValue) => string;
};

type UseLenientInputResult = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
};

/**
 * Keeps the user's raw text visible until blur while synchronizing a parsed value upstream.
 *
 * For non-primitive values, callers should keep `value` referentially stable when the semantic
 * value has not changed. Passing a distinct but equal object/array instance is treated as an
 * external value change and resynchronizes the displayed text from `formatValue(value)`.
 */
export function useLenientInput<TValue>({
  value,
  setValue,
  deriveValue,
  formatValue,
}: UseLenientInputOptions<TValue>): UseLenientInputResult {
  const [state, setState] = useState(() => ({
    inputValue: formatValue(value),
    syncedValue: value,
  }));
  const displayedValue =
    state.syncedValue === value ? state.inputValue : formatValue(value);

  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const nextInputValue = e.target.value;
      const nextValue = deriveValue(nextInputValue, value);
      setState({
        inputValue: nextInputValue,
        syncedValue: nextValue,
      });
      setValue(nextValue);
    },
    [deriveValue, setValue, value],
  );

  const onBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>(() => {
    setState({
      inputValue: formatValue(value),
      syncedValue: value,
    });
  }, [formatValue, value]);

  return useMemo(
    () => ({
      value: displayedValue,
      onChange,
      onBlur,
    }),
    [displayedValue, onChange, onBlur],
  );
}
