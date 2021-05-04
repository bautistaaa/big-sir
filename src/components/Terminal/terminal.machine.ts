import { assign, createMachine } from 'xstate';

import fileDirectory, { Contents } from '../../shared/fileDirectory';
import getDirectoryContents from '../../utils/getDirectoryContents';

export type CommandType = 'real' | 'fake';
export interface Command {
  input: string;
  type: CommandType;
  output: string;
  cwd: string;
}
export interface Context {
  index: number;
  historyIndex: number;
  commands: Command[];
  keysCurrentlyPressed: string[];
  currentCommand: string;
  cwd: string;
  cwdContents: Contents;
}
type AddCommandEvent = {
  type: 'ADD_COMMAND';
  payload: { command: Command };
};
type ClearEvent = {
  type: 'CLEAR';
};
type ChangeDirectoryEvent = {
  type: 'CHANGE_DIRECTORY';
  payload: { path: string };
};
type DecrementHistoryEvent = {
  type: 'DECREMENT_HISTORY';
};
type IncrementHistoryEvent = {
  type: 'INCREMENT_HISTORY';
};
type KeyDownEvent = {
  type: 'KEY_DOWN';
  payload: { key: string };
};
type KeyUpEvent = {
  type: 'KEY_UP';
  payload: { key: string };
};
type SetCurrentCommandEvent = {
  type: 'SET_CURRENT_COMMAND';
  payload: { command: string };
};

type TerminalEvent =
  | AddCommandEvent
  | ClearEvent
  | ChangeDirectoryEvent
  | DecrementHistoryEvent
  | IncrementHistoryEvent
  | KeyDownEvent
  | KeyUpEvent
  | SetCurrentCommandEvent;

const filterDuplicates = (arr: string[], key: string) => {
  return arr.filter((k) => k !== key);
};

const config = {
  actions: {
    addCommand: assign<Context, TerminalEvent>((context, event) => {
      const newIndex =
        (event as AddCommandEvent).payload.command.type !== 'fake'
          ? context.index + 1
          : context.index;
      return {
        ...context,
        index: newIndex,
        historyIndex: newIndex,
        commands: [
          ...context.commands,
          (event as AddCommandEvent).payload.command,
        ],
        currentCommand: '',
      };
    }),
    clear: assign<Context, TerminalEvent>((context) => {
      return {
        ...context,
        index: 0,
        historyIndex: 0,
        commands: [],
        keysCurrentlyPressed: [],
        currentCommand: '',
      };
    }),
    changeDirectory: assign<Context, TerminalEvent>((context, event) => {
      let newCwd = context.cwd;
      let newCwdContents = context.cwdContents;
      const {
        payload: { path = '' },
      } = event as ChangeDirectoryEvent;

      switch (path) {
        case '/':
          newCwd = '/';
          newCwdContents = getDirectoryContents([]);
          break;
        case '..':
          if (context.cwd !== '/') {
            const pathParts = context.cwd.split('/').filter(Boolean);
            newCwd = pathParts.slice(0, pathParts.length - 1).join('/') || '/';
            newCwdContents = getDirectoryContents(
              newCwd === '/' ? [] : newCwd.split('/')
            );
          }
          break;
        default:
          const strippedPath = path.replace(/\/$/, '');
          const parts = strippedPath.split('/');
          if (parts.length === 1) {
            for (const [key, value] of Object.entries(context.cwdContents)) {
              if (key === strippedPath) {
                newCwdContents = value.contents;
                newCwd = `${
                  context.cwd === '/' ? '' : context.cwd
                }/${strippedPath}`;
              }
            }
          } else {
            newCwdContents = getDirectoryContents(parts, context.cwdContents);
            newCwd = parts.join('/');
          }
      }

      if (typeof newCwdContents === 'string') {
        return {
          ...context,
        };
      }
      return {
        ...context,
        cwd: newCwd,
        cwdContents: newCwdContents,
      };
    }),
    decrementHistory: assign<Context, TerminalEvent>((context) => {
      return {
        ...context,
        historyIndex:
          context.historyIndex - 1 < 0 ? 0 : context.historyIndex - 1,
      };
    }),
    incrementHistory: assign<Context, TerminalEvent>((context) => {
      return {
        ...context,
        historyIndex:
          context.historyIndex + 1 > context.commands.length
            ? context.commands.length
            : context.historyIndex + 1,
      };
    }),
    keyDown: assign<Context, TerminalEvent>((context, event) => {
      return {
        ...context,
        keysCurrentlyPressed: [
          ...filterDuplicates(
            context.keysCurrentlyPressed,
            (event as KeyDownEvent).payload.key
          ),
          (event as KeyDownEvent).payload.key,
        ],
      };
    }),
    keyUp: assign<Context, TerminalEvent>((context, event) => {
      const {
        payload: { key },
      } = event as KeyUpEvent;
      if (key === 'Meta') {
        return {
          ...context,
          keysCurrentlyPressed: [],
        };
      }

      return {
        ...context,
        keysCurrentlyPressed: filterDuplicates(
          context.keysCurrentlyPressed,
          key
        ),
      };
    }),
    setCurrentCommand: assign<Context, TerminalEvent>(
      (context, event) => {
        return {
          ...context,
          currentCommand: (event as SetCurrentCommandEvent).payload.command,
        };
      }
    ),
  },
};

// Context, Event, State
const appMachine = createMachine<Context, TerminalEvent, any>(
  {
    id: 'app',
    context: {
      index: 0,
      historyIndex: 0,
      commands: [],
      keysCurrentlyPressed: [],
      currentCommand: '',
      cwd: '/',
      cwdContents: fileDirectory['/'].contents,
    },
    strict: true,
    on: {
      ADD_COMMAND: {
        actions: ['addCommand'],
      },
      CLEAR: {
        actions: ['clear'],
      },
      CHANGE_DIRECTORY: {
        actions: ['changeDirectory'],
      },
      DECREMENT_HISTORY: {
        actions: ['decrementHistory'],
      },
      INCREMENT_HISTORY: {
        actions: ['incrementHistory'],
      },
      KEY_DOWN: {
        actions: ['keyDown'],
      },
      KEY_UP: {
        actions: ['keyUp'],
      },
      SET_CURRENT_COMMAND: {
        actions: ['setCurrentCommand'],
      },
    },
  },
  config
);

export default appMachine;
