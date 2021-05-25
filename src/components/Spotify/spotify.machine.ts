import { assign, createMachine } from 'xstate';

export interface Context {
  data: unknown;
}

type FetchEvent = {
  type: 'FETCH';
};
type ResolveEvent = {
  type: 'RESOLVE';
  payload: { data: unknown };
};

export type SpotifyEvent = FetchEvent | ResolveEvent;

const config = {
  actions: {
    resolve: assign<Context, ResolveEvent>((context, event) => {
      return {
        ...context,
        data: event.payload.data,
      };
    }),
  },
};
const spotifyMachine = createMachine<Context, SpotifyEvent, any>(
  {
    id: 'spotify',
    initial: 'idle',
    context: {
      data: {},
    },
    strict: true,
    states: {
      idle: {
        on: { FETCH: 'loading' },
      },
      loading: {
        entry: ['load'],
        on: {
          RESOLVE: {
            actions: ['resolve'],
          },
        },
      },
      success: {},
    },
  },
  config as any
);

export default spotifyMachine;
