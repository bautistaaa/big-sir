import { useReducer } from 'react';

export const ADD_COMMAND = 'addCommand';
export const CLEAR = 'clear';
export const DECREMENT_HISTORY = 'decrementHistory';
export const INCREMENT_HISTORY = 'incrementHistory';
export const KEY_DOWN = 'keyDown';
export const KEY_UP = 'keyUp';
export const SET_CURRENT_COMMAND = 'setCurrentCommand';

export type CommandType = 'real' | 'fake';
export interface Command {
  input: string;
  type: CommandType;
  output: string;
}
interface PrompState {
  index: number;
  historyIndex: number;
  commands: Command[];
  keysCurrentlyPressed: string[];
  currentCommand: string;
}
export type Action =
  | { type: typeof ADD_COMMAND; payload: { command: Command } }
  | { type: typeof CLEAR }
  | { type: typeof DECREMENT_HISTORY }
  | { type: typeof INCREMENT_HISTORY }
  | { type: typeof KEY_DOWN; payload: { key: string } }
  | { type: typeof KEY_UP; payload: { key: string } }
  | { type: typeof SET_CURRENT_COMMAND; payload: { command: string } };

const filterDuplicates = (arr: string[], key: string) => {
  return arr.filter((k) => k !== key);
};

const reducer = (state: PrompState, action: Action) => {
  switch (action.type) {
    case ADD_COMMAND:
      const newIndex =
        action.payload.command.type !== 'fake' ? state.index + 1 : state.index;
      return {
        ...state,
        index: newIndex,
        historyIndex: newIndex,
        commands: [...state.commands, action.payload.command],
        currentCommand: ''
      };
    case DECREMENT_HISTORY:
      return {
        ...state,
        historyIndex: state.historyIndex - 1 < 0 ? 0 : state.historyIndex - 1,
      };
    case INCREMENT_HISTORY:
      return {
        ...state,
        historyIndex:
          state.historyIndex + 1 > state.commands.length
            ? state.commands.length
            : state.historyIndex + 1,
      };
    case KEY_DOWN:
      return {
        ...state,
        keysCurrentlyPressed: [
          ...filterDuplicates(state.keysCurrentlyPressed, action.payload.key),
          action.payload.key,
        ],
      };
    case KEY_UP:
      const {
        payload: { key },
      } = action;
      if (key === 'Meta') {
        return {
          ...state,
          keysCurrentlyPressed: [],
        };
      }

      return {
        ...state,
        keysCurrentlyPressed: filterDuplicates(state.keysCurrentlyPressed, key),
      };
    case SET_CURRENT_COMMAND:
      return {
        ...state,
        currentCommand: action.payload.command,
      };
    case CLEAR:
      return {
        index: 0,
        historyIndex: 0,
        commands: [],
        keysCurrentlyPressed: [],
        currentCommand: '',
      };
    default:
      throw new Error();
  }
};

const usePromptState = () => {
  return useReducer(reducer, {
    index: 0,
    historyIndex: 0,
    commands: [],
    keysCurrentlyPressed: [],
    currentCommand: '',
  });
};

export default usePromptState;
