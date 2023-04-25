import { useMachine } from '@xstate/react';
import { createContext, FC, useContext } from 'react';
import { Interpreter, Sender } from 'xstate';
import spotifyMachine, { Context, SpotifyEvent } from './spotify.machine';
import useLocalStorage from '../../hooks/useLocalStorage';

type SpotifyContextValue = Interpreter<
  Context,
  any,
  SpotifyEvent,
  {
    value: any;
    context: Context;
  },
  any
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

const SpotifyProvider: FC = ({ children }) => {
  const [token] = useLocalStorage('token', '');
  const [, , service] = useMachine(spotifyMachine, {
    devTools: true,
    services: {
      checkedIfLoggedIn: () => (send: Sender<SpotifyEvent>) => {
        if (!!token) {
          send('JWT_VALID');
        } else {
          send('JWT_INVALID');
        }
      },
    },
  });

  return (
    <SpotifyContext.Provider value={service}>
      {children}
    </SpotifyContext.Provider>
  );
};

export { SpotifyProvider, useSpotifyContext };
