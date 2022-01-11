import { assign, createMachine } from 'xstate';

import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

export interface AlbumDetailsMachineContext {
  id?: string;
  albumDetails?: SpotifyApi.SingleAlbumResponse;
  next?: string;
  errorMessage?: string;
}

type RefreshEvent = {
  type: 'REFRESH';
  payload: { albumId: string };
};
export type AlbumDetailsMachineEvent =
  | {
      type: 'SCROLL_TO_BOTTOM';
    }
  | {
      type: 'RECEIVED_DATA';
      data: SpotifyApi.SingleAlbumResponse;
    }
  | RefreshEvent;

const createAlbumDetailsMachine = (id: string) =>
  createMachine<AlbumDetailsMachineContext, AlbumDetailsMachineEvent>(
    {
      id: 'albumDetails',
      initial: 'load',
      context: {
        id,
        albumDetails: undefined,
        next: undefined,
        errorMessage: undefined,
      },
      states: {
        load: {
          invoke: {
            src: 'fetchAlbumDetails',
            onDone: {
              target: 'idle',
              actions: 'assignDataToContext',
            },
            onError: {
              target: 'idle',
              actions: 'assignErrorMessageToContext',
            },
          },
        },
        loadMore: {
          on: {
            RECEIVED_DATA: {
              target: 'checkingIfThereIsMoreData',
              actions: 'appendTracksToContext',
            },
          },
          invoke: {
            src: 'fetchMoreTracks',
            onError: {
              target: 'idle',
              actions: 'assignErrorMessageToContext',
            },
          },
        },
        idle: {
          exit: ['clearErrorMessage'],
          on: {
            SCROLL_TO_BOTTOM: 'loadMore',
            REFRESH: {
              target: 'load',
              actions: 'resetContext',
            },
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
          on: {
            REFRESH: {
              target: 'load',
              actions: 'resetContext',
            },
          },
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
        resetContext: assign((_, e) => ({
          id: (e as RefreshEvent).payload.albumId,
          albumDetails: undefined,
          next: undefined,
          errorMessage: undefined,
        })),
        assignDataToContext: assign((context, event: any) => {
          return {
            albumDetails: {
              ...event.data,
              tracks: {
                ...event.data?.tracks,
                items: [
                  ...(context.albumDetails?.tracks?.items ?? []),
                  ...event.data?.tracks?.items,
                ],
              },
            },
            next: event.data?.tracks?.next,
          };
        }),
        appendTracksToContext: assign((context: any, event: any) => {
          return {
            albumDetails: {
              ...context.albumDetails,
              tracks: {
                ...context?.albumDetails?.tracks,
                items: [
                  ...(context.albumDetails?.tracks?.items ?? []),
                  ...event.data?.items,
                ],
              },
            },
            next: event.data?.next,
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
        fetchMoreTracks: (context: AlbumDetailsMachineContext) => async (
          send
        ) => {
          if (context.next) {
            const albumDetails = await request<SpotifyApi.SingleAlbumResponse>(
              context.next
            );
            send({ type: 'RECEIVED_DATA', data: albumDetails });
          }
        },
        fetchAlbumDetails: async (
          context: AlbumDetailsMachineContext
        ) => {
          const albumDetails: SpotifyApi.SingleAlbumResponse = await request(
            `${spotifyConfig.apiUrl}/albums/${context.id}`
          );
          console.log({albumDetails})
          return albumDetails;
        },
      },
    }
  );

export default createAlbumDetailsMachine;
