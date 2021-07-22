import { useMachine } from '@xstate/react';
import { createContext, FC, memo, useContext, useEffect } from 'react';
import { Interpreter } from 'xstate';
import createSpotifyMachine, { Context, SpotifyEvent } from './spotify.machine';
import useLocalStorage from '../../hooks/useLocalStorage';

type SpotiyContextValue = Interpreter<
  Context,
  any,
  SpotifyEvent,
  {
    value: any;
    context: Context;
  }
>;

export const SpotifyContext = createContext<SpotiyContextValue>(
  {} as Interpreter<
    Context,
    any,
    SpotifyEvent,
    {
      value: any;
      context: Context;
    }
  >
);

const useSpotifyContext = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotifyContext must be used within a SpotifyProvider');
  }
  return context;
};

const SpotifyProvider: FC = memo(({ children }) => {
  const [token] = useLocalStorage('token', '');
  const [, , service] = useMachine(createSpotifyMachine(token));
  console.count('provider');

  return (
    <SpotifyContext.Provider value={service}>
      {children}
    </SpotifyContext.Provider>
  );
});

export { SpotifyProvider, useSpotifyContext };
