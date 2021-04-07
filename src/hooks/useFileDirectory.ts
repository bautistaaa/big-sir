import { useReducer } from 'react';
import fileDirectory from '../shared/fileDirectory';

export const CHANGE_DIRECTORY = 'changeDirectory';
export const RUN_COMMAND = 'runCommand';

export type Action =
  | {
      type: typeof CHANGE_DIRECTORY;
      payload: { path: string };
    }
  | {
      type: typeof RUN_COMMAND;
      payload: { command: string };
    };

export interface State {
  cwd: string;
  currentFileOrDirectory: any;
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case CHANGE_DIRECTORY:
      return {
        ...state,
        cwd: '',
      };
    case RUN_COMMAND:
      return {
        ...state,
        currentFileOrDirectory: {},
      };
    default:
      throw new Error();
  }
}

const useFileDirectory = () => {
  return useReducer(reducer, {
    cwd: '/',
    currentFileOrDirectory: fileDirectory,
  });
};

export default useFileDirectory;
