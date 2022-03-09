import { useMachine } from '@xstate/react';
import { createContext, FC, useContext } from 'react';
import { Interpreter } from 'xstate';
import appMachine, { Context, AppEvent } from './app.machine';

type AppContextValue = Interpreter<
  Context,
  any,
  AppEvent,
  {
    value: any;
    context: Context;
  }
>;

export const AppContext = createContext<AppContextValue>(
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

const useAppContext = () => useContext(AppContext);

const AppProvider: FC = ({ children }) => {
  const [, , service] = useMachine(appMachine);

  return <AppContext.Provider value={service}>{children}</AppContext.Provider>;
};

export { AppProvider, useAppContext };
