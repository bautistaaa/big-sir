import { Machine, assign } from 'xstate';

interface PlayerStates {
  states: {
    idle: {};
    pending: {};
    successful: {};
    failed: {};
  };
}

type PlayerMachineEvents =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; results: any[] }
  | { type: 'REJECT'; message: string };

interface PlayerContext {
  playbackState: Spotify.PlaybackState | undefined;
}

export const fetchMachine = Machine<
  PlayerContext,
  PlayerStates,
  PlayerMachineEvents
>(
  {
    id: 'player',
    initial: 'idle',
    context: {
      playbackState: undefined,
    },
    states: {
      idle: {
        on: {
          FETCH: 'pending',
        },
      },
      pending: {
        entry: ['fetchData'],
        on: {
          RESOLVE: { target: 'successful', actions: ['setResults'] },
          REJECT: { target: 'failed', actions: ['setMessage'] },
        },
      },
      failed: {
        on: {
          FETCH: 'pending',
        },
      },
      successful: {
        on: {
          FETCH: 'pending',
        },
      },
    },
  },
  {
    actions: {
      setResults: assign((ctx, event: any) => ({
        results: event.results,
      })),
      setMessage: assign((ctx, event: any) => ({
        message: event.message,
      })),
    },
  }
);
