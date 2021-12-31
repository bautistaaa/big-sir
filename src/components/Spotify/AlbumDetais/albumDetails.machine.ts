import { assign, createMachine } from 'xstate';

export interface AlbumDetailsContext {
  data?: SpotifyApi.AlbumObjectFull;
}

export type AlbumDetailsEvent = {
  type: 'RECEIVED_DATA';
  data: SpotifyApi.AlbumObjectFull;
};

const albumDetailsMachine = createMachine<
  AlbumDetailsContext,
  AlbumDetailsEvent
>({
  id: 'albumDetails',
  initial: 'loading',
  context: {
    data: undefined,
  },
  states: {
    loading: {
      on: {
        RECEIVED_DATA: {
          target: 'success',
          actions: assign({
            data: (_, event) => event.data,
          }),
        },
      },
    },
    success: { type: 'final' },
    error: {},
  },
});

export default albumDetailsMachine;
