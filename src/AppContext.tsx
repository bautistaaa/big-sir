import { useMachine } from '@xstate/react';
import React, { FC, useContext } from 'react';
import { Event, EventData, SCXML, SingleOrArray, State } from 'xstate';
import appMachine, { Context, AppEvent } from './app.machine';

interface AppContextValues {
  current: State<Context, AppEvent, any, any>;
  send: (
    event: SingleOrArray<Event<AppEvent>> | SCXML.Event<AppEvent>,
    payload?: EventData | undefined
  ) => State<Context, AppEvent, any, any>;
}

const AppContext = React.createContext<AppContextValues>({
  current: {} as State<Context, AppEvent, any, any>,
  send: () => ({} as State<Context, AppEvent, any, any>),
});

const useAppContext = () => useContext(AppContext);

const AppProvider: FC = ({ children }) => {
  const [current, send] = useMachine(appMachine, { devTools: true });

  return (
    <AppContext.Provider value={{ current, send }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, useAppContext };
