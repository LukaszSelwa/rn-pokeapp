import { useCallback, useEffect, useRef, useState } from "react";

type Callback<T> = (state: T) => void;

type SetStateCallbackType<T> = (
  newState: (prev: T) => T,
  cb?: Callback<T>
) => void;

export default function useStateCallback<T>(
  initialState: T
): [T, SetStateCallbackType<T>] {
  const [state, setState] = useState<T>(initialState);
  const cbRef = useRef<Callback<T>>();

  const setStateCallback = useCallback(
    (newState: (prev: T) => T, cb?: Callback<T>) => {
      cbRef.current = cb;
      setState((prev) => newState(prev));
    },
    []
  );

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined;
    }
  }, [state]);

  return [state, setStateCallback];
}
