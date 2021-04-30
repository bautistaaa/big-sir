import { assign, createMachine } from 'xstate';
import { AppType } from './shared/configs';

const INITIAL_ZINDEX = 100;

interface ActiveWindow {
  name: AppType;
  zIndex: number;
  focused: boolean;
  defaultUrl?: string;
}
interface MinimizedWindow {
  name: AppType;
}
export interface Context {
  activeWindows: ActiveWindow[];
  minimizedWindows: MinimizedWindow[];
}

type FocusWindowEvent = {
  type: 'FOCUS_WINDOW';
  payload: { name: AppType; defaultUrl?: string };
};
type MinimizeWindowEvent = {
  type: 'MINIMIZE_WINDOW';
  payload: { name: AppType };
};
type UnminimizeWindowEvent = {
  type: 'UNMINIMIZE_WINDOW';
  payload: { name: AppType };
};
type RemoveWindowEvent = {
  type: 'REMOVE_WINDOW';
  payload: { name: AppType };
};

export type AppEvent =
  | FocusWindowEvent
  | MinimizeWindowEvent
  | UnminimizeWindowEvent
  | RemoveWindowEvent;

const config = {
  actions: {
    focusWindow: assign<Context, AppEvent>((context, event) => {
      const maxZIndex = Math.max(
        ...context.activeWindows.map((x) => x.zIndex),
        INITIAL_ZINDEX
      );

      const refocusedWindows = context.activeWindows.map((aw) => {
        if (aw.name === event.payload.name) {
          return {
            ...aw,
            zIndex: maxZIndex + 1,
            focused: true,
            defaultUrl: (event as FocusWindowEvent).payload.defaultUrl,
          };
        }

        return { ...aw, focused: false };
      });

      // We need to open a new window:
      if (
        !refocusedWindows.find(
          ({ name }: { name: string }) => name === event.payload.name
        )
      ) {
        refocusedWindows.push({
          name: event.payload.name,
          defaultUrl: (event as FocusWindowEvent).payload.defaultUrl,
          zIndex: maxZIndex + 1,
          focused: true,
        });
      }

      return {
        ...context,
        activeWindows: refocusedWindows,
      };
    }),
    minimizeWindow: assign<Context, AppEvent>((context, event) => {
      return {
        ...context,
        minimizedWindows: [
          ...context.minimizedWindows,
          { name: event.payload.name },
        ],
      };
    }),
    unminimizeWindow: assign<Context, AppEvent>((context, event) => {
      const minimizedWindows = context.minimizedWindows.filter(
        (w) => w.name !== event.payload.name
      );
      return {
        ...context,
        minimizedWindows,
      };
    }),
    removeWindow: assign<Context, AppEvent>((context, event) => {
      return {
        ...context,
        activeWindows: context.activeWindows.filter(
          (aw) => aw.name !== event.payload.name
        ),
      };
    }),
  },
};

// Context, Event, State
const appMachine = createMachine<Context, AppEvent, any>(
  {
    id: 'app',
    context: {
      activeWindows: [],
      minimizedWindows: [],
    },
    strict: true,
    on: {
      FOCUS_WINDOW: {
        actions: ['focusWindow'],
      },
      MINIMIZE_WINDOW: {
        actions: ['minimizeWindow'],
      },
      UNMINIMIZE_WINDOW: {
        actions: ['unminimizeWindow'],
      },
      REMOVE_WINDOW: {
        actions: ['removeWindow'],
      },
    },
  },
  config
);

export default appMachine;
