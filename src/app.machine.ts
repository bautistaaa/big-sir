import { assign, createMachine } from 'xstate';
import { AppType } from './shared/app-configs';

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
type Mode = 'light' | 'dark';
export interface Context {
  activeWindows: ActiveWindow[];
  minimizedWindows: MinimizedWindow[];
  mode: Mode;
}

type FocusWindowEvent = {
  type: 'FOCUS_WINDOW';
  payload: { name: AppType; defaultUrl?: string };
};
type MinimizeWindowEvent = {
  type: 'MINIMIZE_WINDOW';
  payload: { name: AppType };
};
type RemoveWindowEvent = {
  type: 'REMOVE_WINDOW';
  payload: { name: AppType };
};
type ToggleModeEvent = {
  type: 'TOGGLE_MODE';
  payload: { mode: Mode };
};

export type AppEvent =
  | FocusWindowEvent
  | MinimizeWindowEvent
  | RemoveWindowEvent
  | ToggleModeEvent;

const config = {
  actions: {
    focusWindow: assign<Context, AppEvent>((context, event) => {
      const minimizedWindows = context.minimizedWindows.filter(
        (w) => w.name !== (event as FocusWindowEvent).payload.name
      );
      const maxZIndex = Math.max(
        ...context.activeWindows.map((x) => x.zIndex),
        INITIAL_ZINDEX
      );

      const refocusedWindows = context.activeWindows.map((aw) => {
        if (aw.name === (event as FocusWindowEvent).payload.name) {
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
          ({ name }: { name: string }) =>
            name === (event as FocusWindowEvent).payload.name
        )
      ) {
        refocusedWindows.push({
          name: (event as FocusWindowEvent).payload.name,
          defaultUrl: (event as FocusWindowEvent).payload.defaultUrl,
          zIndex: maxZIndex + 1,
          focused: true,
        });
      }

      return {
        ...context,
        activeWindows: refocusedWindows,
        minimizedWindows,
      };
    }),
    minimizeWindow: assign<Context, AppEvent>((context, event) => {
      return {
        ...context,
        minimizedWindows: [
          ...context.minimizedWindows,
          { name: (event as MinimizeWindowEvent).payload.name },
        ],
      };
    }),
    removeWindow: assign<Context, AppEvent>((context, event) => {
      const activeWindows = context.activeWindows
        .filter((aw) => aw.name !== (event as RemoveWindowEvent).payload.name)
        .sort((a, b) => {
          return b.zIndex - a.zIndex;
        })
        .map((aw, i) => {
          if (i === 0) {
            return {
              ...aw,
              focused: true,
            };
          }

          return aw;
        });

      return {
        ...context,
        activeWindows,
      };
    }),
    toggleMode: assign<Context, AppEvent>((context, event) => {
      return {
        ...context,
        mode: (event as ToggleModeEvent).payload.mode,
      };
    }),
  },
};

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const appMachine = createMachine<Context, AppEvent, any>(
  {
    id: 'app',
    context: {
      activeWindows: [],
      minimizedWindows: [],
      mode: isDarkMode ? 'dark' : 'light',
    },
    strict: true,
    on: {
      FOCUS_WINDOW: {
        actions: ['focusWindow'],
      },
      MINIMIZE_WINDOW: {
        actions: ['minimizeWindow'],
      },
      REMOVE_WINDOW: {
        actions: ['removeWindow'],
      },
      TOGGLE_MODE: {
        actions: ['toggleMode'],
      },
    },
  },
  config
);

export default appMachine;
