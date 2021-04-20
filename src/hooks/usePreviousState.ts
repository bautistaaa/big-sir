import { useEffect, useRef } from 'react';

const usePreviousState = (initialState: unknown) => {
  let previousState = useRef(initialState);
  useEffect(() => {
    previousState.current = initialState;
  }, [initialState]);

  return previousState.current;
};

export default usePreviousState;
