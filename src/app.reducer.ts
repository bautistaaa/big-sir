import { MutableRefObject } from 'react';

export const REMOVE_WINDOW = 'removeWindow';
export const FOCUS_WINDOW = 'focusWindow';
export const MINIMIZE_WINDOW = 'minimizedWindow';
export const UNMINIMIZE_WINDOW = 'unminimizedWindow';
const INITIAL_ZINDEX = 100;

export type Action =
  | {
      type: typeof FOCUS_WINDOW;
      payload: { name: string; ref: MutableRefObject<HTMLElement | null> };
    }
  | { type: typeof MINIMIZE_WINDOW; payload: { name: string } }
  | { type: typeof UNMINIMIZE_WINDOW; payload: { name: string } }
  | { type: typeof REMOVE_WINDOW; payload: { name: string } };

interface ActiveWindow {
  name: string;
  ref: MutableRefObject<HTMLElement | null>;
  zIndex: number;
  focused: boolean;
}
interface MinimizedWindow {
  name: string;
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
      const filteredAndResetted = state.activeWindows
        .filter((aw) => aw.name !== action.payload.name)
        .map((v) => ({ ...v, focused: false }));

      const maxZIndex = Math.max(
        ...filteredAndResetted.map((x) => x.zIndex),
        INITIAL_ZINDEX
      );
      const activeWindows = [
        {
          name: action.payload.name,
          ref: action.payload.ref,
          zIndex: maxZIndex + 1,
          focused: true,
        },
        ...filteredAndResetted,
      ];

      return {
        ...state,
        activeWindows,
      };
    default:
      throw new Error();
  }
}