import { useReducer } from 'react';

export const MODE_CHANGED = 'modeChanged';
type Mode = 'minimized' | 'maximized' | 'idle';

export type Action = { type: typeof MODE_CHANGED; payload: { mode: Mode } };

export interface State {
  mode: Mode;
  previous: Mode;
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case MODE_CHANGED:
      return {
        ...state,
        previous: state.mode,
        mode: action.payload.mode,
      };
    default:
      throw new Error();
  }
}

const useWindowState = () => {
  return useReducer(reducer, {
    mode: 'idle',
    previous: 'idle',
  });
};

export default useWindowState;
