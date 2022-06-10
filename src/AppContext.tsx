import { useMachine } from '@xstate/react';
import React, { FC, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Interpreter } from 'xstate';
import appMachine, { Context, AppEvent } from './app.machine';

type AppContextValues = Interpreter<
  Context,
  any,
  AppEvent,
  {
    value: any;
    context: Context;
  }
>;

const AppContext = React.createContext<AppContextValues>(
  {} as Interpreter<
    Context,
    any,
    AppEvent,
    {
      value: any;
      context: Context;
    }
  >
);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

const AppProvider: FC = ({ children }) => {
  const [, , service] = useMachine(appMachine);

  return <AppContext.Provider value={service}>{children}</AppContext.Provider>;
};

export { AppProvider, useAppContext };
