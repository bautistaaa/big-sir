import { assign, createMachine } from 'xstate';

export interface Context {
  activeDirectory: string;
}

type DirectoryChangedEvent = {
  type: 'DIRECTORY_CHANGED';
  payload: { name: string };
};

export type FinderEvent =
  | { type: 'LISTS' }
  | { type: 'ICONS' }
  | { type: 'DETAILS' }
  | DirectoryChangedEvent;

const finderMachine = createMachine<Context, FinderEvent>(
  {
    id: 'finder',
    initial: 'lists',
    context: {
      activeDirectory: 'personal',
    },
    states: {
      details: { on: { ICONS: 'icons', LISTS: 'lists' } },
      lists: { on: { DETAILS: 'details', ICONS: 'icons' } },
      icons: { on: { DETAILS: 'details', LISTS: 'lists' } },
    },
    on: {
      DIRECTORY_CHANGED: {
        actions: ['directoryChanged'],
      },
    },
  },
  {
    actions: {
      directoryChanged: assign<Context, FinderEvent>((context, event) => {
        return {
          ...context,
          activeDirectory: (event as DirectoryChangedEvent).payload.name,
        };
      }),
    },
  }
);

export default finderMachine;
