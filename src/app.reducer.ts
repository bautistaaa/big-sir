import { AppType } from './shared/configs';

export const REMOVE_WINDOW = 'removeWindow';
export const FOCUS_WINDOW = 'focusWindow';
export const MINIMIZE_WINDOW = 'minimizedWindow';
export const UNMINIMIZE_WINDOW = 'unminimizedWindow';

const INITIAL_ZINDEX = 100;

export type Action =
  | {
      type: typeof FOCUS_WINDOW;
      payload: { name: AppType; defaultUrl?: string };
    }
  | { type: typeof MINIMIZE_WINDOW; payload: { name: AppType } }
  | { type: typeof UNMINIMIZE_WINDOW; payload: { name: AppType } }
  | { type: typeof REMOVE_WINDOW; payload: { name: string } };

interface ActiveWindow {
  name: AppType;
  zIndex: number;
  focused: boolean;
  defaultUrl?: string;
}
interface MinimizedWindow {
  name: AppType;
}
export interface AppState {
  activeWindows: ActiveWindow[];
  minimizedWindows: MinimizedWindow[];
}

export function reducer(state: AppState, action: Action) {
  switch (action.type) {
    case MINIMIZE_WINDOW:
      return {
        ...state,
        minimizedWindows: [
          ...state.minimizedWindows,
          { name: action.payload.name },
        ],
      };
    case UNMINIMIZE_WINDOW:
      const minimizedWindows = state.minimizedWindows.filter(
        (w) => w.name !== action.payload.name
      );
      return {
        ...state,
        minimizedWindows,
      };
    case REMOVE_WINDOW:
      return {
        ...state,
        activeWindows: state.activeWindows.filter(
          (aw) => aw.name !== action.payload.name
        ),
      };
    case FOCUS_WINDOW:
      const maxZIndex = Math.max(
        ...state.activeWindows.map((x) => x.zIndex),
        INITIAL_ZINDEX
      );

      const refocusedWindows = state.activeWindows.map((aw) => {
        if (aw.name === action.payload.name) {
          return {
            ...aw,
            zIndex: maxZIndex + 1,
            focused: true,
            defaultUrl: action.payload.defaultUrl,
          };
        }

        return { ...aw, focused: false };
      });

      // We need to open a new window:
      if (!refocusedWindows.find(({ name }) => name === action.payload.name)) {
        refocusedWindows.push({
          name: action.payload.name,
          defaultUrl: action.payload.defaultUrl,
          zIndex: maxZIndex + 1,
          focused: true,
        });
      }

      return {
        ...state,
        activeWindows: refocusedWindows,
      };
    default:
      throw new Error();
  }
}
