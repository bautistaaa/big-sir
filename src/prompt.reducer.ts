export const DECREMENT_HISTORY = 'decrementHistory';
export const INCREMENT_HISTORY = 'incrementHistory';
export const ADD_COMMAND = 'addCommand';
export const CLEAR = 'clear';

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
}

export type Action =
  | { type: typeof INCREMENT_HISTORY }
  | { type: typeof DECREMENT_HISTORY }
  | { type: typeof ADD_COMMAND; payload: { command: Command } }
  | { type: typeof CLEAR };

export function reducer(state: PrompState, action: Action) {
  switch (action.type) {
    case INCREMENT_HISTORY:
      return {
        ...state,
        historyIndex:
          state.historyIndex + 1 > state.commands.length
            ? state.commands.length
            : state.historyIndex + 1,
      };
    case DECREMENT_HISTORY:
      return {
        ...state,
        historyIndex: state.historyIndex - 1 < 0 ? 0 : state.historyIndex - 1,
      };
    case ADD_COMMAND:
      const newIndex =
        action.payload.command.type !== 'fake' ? state.index + 1 : state.index;
      return {
        ...state,
        index: newIndex,
        historyIndex: newIndex,
        commands: [...state.commands, action.payload.command],
      };
    case CLEAR:
      return {
        index: 0,
        historyIndex: 0,
        commands: [],
      };
    default:
      throw new Error();
  }
}
