import { assign, createMachine, Sender } from 'xstate';

import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

const DEFAULT_URL = `${spotifyConfig.apiUrl}/me/tracks?offset=0&limit=50`;

export interface LikedSongsMachineContext {
  likedSongs?: SpotifyApi.UsersSavedTracksResponse;
  next?: string;
  errorMessage?: string;
}

export type LikedSongsMachineEvent =
  | {
      type: 'SCROLL_TO_BOTTOM';
    }
  | {
      type: 'RECEIVED_DATA';
      data: SpotifyApi.UsersSavedTracksResponse;
    };

const likedSongsMachine = createMachine<
  LikedSongsMachineContext,
  LikedSongsMachineEvent
>(
  {
    id: 'likedSongs',
    initial: 'fetchingRowOfData',
    context: {
      likedSongs: undefined,
      next: undefined,
      errorMessage: undefined,
    },
    states: {
      fetchingRowOfData: {
        on: {
          RECEIVED_DATA: {
            target: 'checkingIfThereIsMoreData',
            actions: 'assignDataToContext',
          },
        },
        invoke: {
          src: 'fetchLikedTracks',
          onError: {
            target: 'idle',
            actions: 'assignErrorMessageToContext',
          },
        },
      },
      idle: {
        exit: ['clearErrorMessage'],
        on: {
          SCROLL_TO_BOTTOM: 'fetchingRowOfData',
        },
      },
      checkingIfThereIsMoreData: {
        always: [
          {
            cond: 'thereIsMoreData',
            target: 'idle',
          },
          {
            target: 'noMoreDataToFetch',
          },
        ],
      },
      noMoreDataToFetch: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      thereIsMoreData: (context) => {
        return !!context?.next;
      },
    },
    actions: {
      assignDataToContext: assign((context, event: any) => {
        if (event.type !== 'RECEIVED_DATA') return {};
        return {
          likedSongs: {
            ...event.data,
            items: [...(context.likedSongs?.items ?? []), ...event.data.items],
          },
          next: event.data.next,
        };
      }),
      clearErrorMessage: assign((_) => ({
        errorMessage: undefined,
      })),
      assignErrorMessageToContext: assign((_, event: any) => {
        return {
          errorMessage: event.data?.message || 'An unknown error occurred',
        };
      }),
    },
    services: {
      fetchLikedTracks: (context: LikedSongsMachineContext) => async (
        send: Sender<LikedSongsMachineEvent>
      ) => {
        const url = context.next || DEFAULT_URL;
        const likedSongs: SpotifyApi.UsersSavedTracksResponse = await request(
          url
        );

        send({ type: 'RECEIVED_DATA', data: likedSongs });
      },
    },
  }
);

export default likedSongsMachine;
