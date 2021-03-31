import { useReducer } from 'react';

const BLOCKED_LIST = [
  'Backspace',
  'Shift',
  'Meta',
  'Escape',
  'Control',
  'Alt',
  'Enter',
];
export const MODE_CHANGED = 'modeChanged';
export const QUEUE_KEY = 'queueKey';
export const ADD_COMMAND = 'addCommand';
type Mode = 'command' | 'visual' | 'insert' | 'normal';

export type Action =
  | { type: typeof MODE_CHANGED; payload: { mode: Mode } }
  | { type: typeof ADD_COMMAND; payload: { command: string } }
  | {
      type: typeof QUEUE_KEY;
      payload: { key: string };
    };

export interface State {
  command: string;
  mode: Mode;
  keysCurrentlyQueued: string[];
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ADD_COMMAND:
      const command = action.payload.command.replace(/(\r\n|\n|\r)/gm, '');
      return {
        ...state,
        command,
      };
    case MODE_CHANGED:
      return {
        ...state,
        mode: action.payload.mode,
        command:
          action.payload.mode === 'normal'
            ? ''
            : action.payload.mode === 'command'
            ? ':'
            : state.command,
      };
    case QUEUE_KEY:
      if (BLOCKED_LIST.includes(action.payload.key)) {
        return { ...state };
      }

      return {
        ...state,
        keysCurrentlyQueued: [...state.keysCurrentlyQueued, action.payload.key],
      };
    default:
      throw new Error();
  }
}

const useEditorState = () => {
  return useReducer(reducer, {
    command: '',
    mode: 'normal',
    keysCurrentlyQueued: [],
  });
};

export default useEditorState;
