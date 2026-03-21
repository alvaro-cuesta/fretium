import { useCallback, useState } from 'react';

export type UseLenientInputOptions<TValue> = {
  value: TValue;
  setValue: (nextValue: TValue) => void;
  deriveValue: (inputValue: string, currentValue: TValue) => TValue;
  formatValue: (value: TValue) => string;
};

export type UseLenientInputResult = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
};

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

  return {
    value: displayedValue,
    onChange,
    onBlur,
  };
}
