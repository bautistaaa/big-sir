import { assign, createMachine } from 'xstate';

const BLOCKED_LIST = [
  'Backspace',
  'Shift',
  'Meta',
  'Escape',
  'Control',
  'Alt',
  'Enter',
];

export interface Context {
  command: string;
  mode: Mode;
  keysCurrentlyQueued: string[];
}
type Mode = 'command' | 'visual' | 'insert' | 'normal';
type ModeChangedEvent = {
  type: 'MODE_CHANGED';
  payload: { mode: Mode };
};
type AddCommandEvent = {
  type: 'ADD_COMMAND';
  payload: { command: string };
};
type QueueKeyEvent = {
  type: 'QUEUE_KEY';
  payload: { key: string };
};

export type EditorEvent = AddCommandEvent | ModeChangedEvent | QueueKeyEvent;

const config = {
  actions: {
    addCommand: assign<Context, AddCommandEvent>((context, event) => {
      const command = (event as AddCommandEvent).payload.command.replace(
        /(\r\n|\n|\r)/gm,
        ''
      );
      return {
        ...context,
        command,
      };
    }),
    modeChanged: assign<Context, ModeChangedEvent>((context, event) => {
      return {
        ...context,
        mode: event.payload.mode,
        command:
          event.payload.mode === 'normal'
            ? ''
            : event.payload.mode === 'command'
            ? ':'
            : context.command,
      };
    }),
    queueKey: assign<Context, QueueKeyEvent>((context, event) => {
      if (BLOCKED_LIST.includes(event.payload.key)) {
        return { ...context };
      }

      return {
        ...context,
        keysCurrentlyQueued: [
          ...context.keysCurrentlyQueued,
          event.payload.key,
        ],
      };
    }),
  },
};

const appMachine = createMachine<Context, EditorEvent, any>(
  {
    id: 'app',
    context: {
      command: '',
      mode: 'normal',
      keysCurrentlyQueued: [],
    },
    strict: true,
    on: {
      ADD_COMMAND: {
        actions: ['addCommand'],
      },
      MODE_CHANGED: {
        actions: ['modeChanged'],
      },
      QUEUE_KEY: {
        actions: ['queueKey'],
      },
    },
  },
  config as any
);

export default appMachine;
