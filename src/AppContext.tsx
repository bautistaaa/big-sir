import React, { FC, useContext, useReducer } from 'react';
import { reducer as appReducer, Action, AppState } from './app.reducer';

interface AppContextValues {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = React.createContext<AppContextValues>({
  state: {
    activeWindows: [],
    minimizedWindows: [],
  },
  dispatch: () => {},
});

const useAppContext = () => useContext(AppContext);

const initialState: AppState = {
  activeWindows: [],
  minimizedWindows: [],
};

const AppProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
