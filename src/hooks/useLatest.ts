import { useRef } from 'react';

export function useLatest<T>(value: T) {
  const ref = useRef<T>(value);
  // eslint-disable-next-line react-hooks/refs -- this should be a legitimate use of a ref (class-like instance variable that doesn't trigger re-renders)
  ref.current = value;
  return ref;
}
