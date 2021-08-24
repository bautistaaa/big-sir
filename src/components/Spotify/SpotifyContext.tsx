import { useMachine } from '@xstate/react';
import { createContext, FC, memo, useContext } from 'react';
import { Interpreter } from 'xstate';
import createSpotifyMachine, { Context, SpotifyEvent } from './spotify.machine';
import useLocalStorage from '../../hooks/useLocalStorage';

type SpotifyContextValue = Interpreter<
  Context,
  any,
  SpotifyEvent,
  {
    value: any;
    context: Context;
  }
>;

export const SpotifyContext = createContext<SpotifyContextValue>(
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

  return (
    <SpotifyContext.Provider value={service}>
      {children}
    </SpotifyContext.Provider>
  );
});

export { SpotifyProvider, useSpotifyContext };
