import { useMachine } from '@xstate/react';
import { createContext, FC, useContext, useMemo } from 'react';
import { Event, EventData, SCXML, SingleOrArray, State } from 'xstate';
import createSpotifyMachine, { Context, SpotifyEvent } from './spotify.machine';
import useLocalStorage from '../../hooks/useLocalStorage';

interface SpotifyContextValues {
  current: State<Context, SpotifyEvent, any, any>;
  send: (
    event: SingleOrArray<Event<SpotifyEvent>> | SCXML.Event<SpotifyEvent>,
    payload?: EventData | undefined
  ) => State<Context, SpotifyEvent, any, any>;
}

const SpotifyContext = createContext<SpotifyContextValues>({
  current: {} as State<Context, SpotifyEvent, any, any>,
  send: () => ({} as State<Context, SpotifyEvent, any, any>),
});

const useSpotifyContext = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotifyContext must be used within a SpotifyProvider');
  }
  return context;
};

const SpotifyProvider: FC = ({ children }) => {
  const [token] = useLocalStorage('token', '');
  const [current, send] = useMachine(createSpotifyMachine(token));
  console.log('shit');
  const value = useMemo(
    () => ({
      current,
      send,
    }),
    [current, send]
  );

  return (
    <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>
  );
};

export { SpotifyProvider, useSpotifyContext };
