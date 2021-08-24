import { Machine, assign } from 'xstate';

interface FetchStates {
  states: {
    idle: {};
    pending: {};
  };
}

type FetchMachineEvents =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; results: SpotifyApi.SearchResponse }
  | { type: 'REJECT'; message: string };

interface FetchContext {
  results: SpotifyApi.SearchResponse;
  message: string;
}

const fetchMachine = Machine<FetchContext, FetchStates, FetchMachineEvents>(
  {
    id: 'fetch',
    initial: 'idle',
    context: {
      results: {},
      message: '',
    },
    states: {
      idle: {
        on: {
          FETCH: 'pending',
        },
      },
      pending: {
        entry: ['fetchResults'],
        on: {
          RESOLVE: { target: 'idle', actions: ['setResults'] },
          REJECT: { target: 'idle', actions: ['setMessage'] },
        },
      },
    },
  },
  {
    actions: {
      setResults: assign((_, event: any) => ({
        results: event.results,
      })),
      setMessage: assign((_, event: any) => ({
        message: event.message,
      })),
    },
  }
);

export default fetchMachine;
