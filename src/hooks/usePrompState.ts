import { useReducer } from 'react';

export const ADD_COMMAND = 'addCommand';
export const CLEAR = 'clear';
export const DECREMENT_HISTORY = 'decrementHistory';
export const INCREMENT_HISTORY = 'incrementHistory';
export const KEY_PRESSED = 'keyPressed';

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
}
export type Action =
  | { type: typeof ADD_COMMAND; payload: { command: Command } }
  | { type: typeof CLEAR }
  | { type: typeof DECREMENT_HISTORY }
  | { type: typeof INCREMENT_HISTORY }
  | { type: typeof KEY_PRESSED; payload: { key: string } };

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
    case KEY_PRESSED:
      return {
        ...state,
      };
    case CLEAR:
      return {
        index: 0,
        historyIndex: 0,
        commands: [],
        keysCurrentlyPressed: [],
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
  });
};

export default usePromptState;
