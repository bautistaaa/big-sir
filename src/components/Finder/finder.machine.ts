import { assign, createMachine } from 'xstate';

export interface Context {
  activeDirectory: string;
  directories: Record<string, SidebarItem>;
}

type DirectoryChangedEvent = {
  type: 'DIRECTORY_CHANGED';
  payload: { name: string };
};

type CreateDirectoryEvent = {
  type: 'CREATE_DIRECTORY';
  payload: { name: string };
};

export type FinderEvent =
  | { type: 'LISTS' }
  | { type: 'ICONS' }
  | { type: 'DETAILS' }
  | DirectoryChangedEvent
  | CreateDirectoryEvent;

type ItemType = 'directory' | 'desktop' | 'applications';
interface SidebarItem {
  type: ItemType;
  path: string[];
}

const SideBarItems: Record<string, SidebarItem> = {
  personal: {
    type: 'directory',
    path: ['home', 'personal'],
  },
  projects: {
    type: 'directory',
    path: ['home', 'projects'],
  },
};

const finderMachine = createMachine<Context, FinderEvent>(
  {
    id: 'finder',
    initial: 'lists',
    context: {
      activeDirectory: 'personal',
      directories: SideBarItems,
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
      CREATE_DIRECTORY: {
        actions: ['createDirectory'],
      },
    },
  },
  {
    actions: {
      directoryChanged: assign<Context, FinderEvent>((_, event) => {
        return {
          activeDirectory: (event as DirectoryChangedEvent).payload.name,
        };
      }),
      createDirectory: assign<Context, FinderEvent>((_, event) => {
        const newDirectory: SidebarItem = {
          type: 'directory',
          path: ['home', (event as CreateDirectoryEvent).payload.name],
        };
        return {
          directories: {
            ...SideBarItems,
            [(event as CreateDirectoryEvent).payload.name]: newDirectory,
          },
        };
      }),
    },
  }
);

export default finderMachine;
