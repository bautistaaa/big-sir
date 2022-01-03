import { assign, createMachine } from 'xstate';

import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

export interface PlaylistDetailsMachineContext {
  id?: string;
  playlistDetails?: SpotifyApi.PlaylistObjectFull;
  next?: string;
  errorMessage?: string;
}

type RefreshEvent = {
  type: 'REFRESH';
  payload: { playlistId: string };
};
export type PlaylistDetailsMachineEvent =
  | {
      type: 'SCROLL_TO_BOTTOM';
    }
  | {
      type: 'RECEIVED_DATA';
      data: SpotifyApi.UsersSavedTracksResponse;
    }
  | RefreshEvent;

const createPlaylistDetailsMachine = (id: string) =>
  createMachine<PlaylistDetailsMachineContext, PlaylistDetailsMachineEvent>(
    {
      id: 'playlistDetails',
      initial: 'load',
      context: {
        id,
        playlistDetails: undefined,
        next: undefined,
        errorMessage: undefined,
      },
      states: {
        load: {
          invoke: {
            src: 'fetchPlaylistDetails',
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
          id: (e as RefreshEvent).payload.playlistId,
          playlistDetails: undefined,
          next: undefined,
          errorMessage: undefined,
        })),
        assignDataToContext: assign((context, event: any) => {
          return {
            playlistDetails: {
              ...event.data,
              tracks: {
                ...event.data?.tracks,
                items: [
                  ...(context.playlistDetails?.tracks?.items ?? []),
                  ...event.data?.tracks?.items,
                ],
              },
            },
            next: event.data?.tracks?.next,
          };
        }),
        appendTracksToContext: assign((context: any, event: any) => {
          return {
            playlistDetails: {
              ...context.playlistDetails,
              tracks: {
                ...context?.playlistDetails?.tracks,
                items: [
                  ...(context.playlistDetails?.tracks?.items ?? []),
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
        fetchMoreTracks: (context: PlaylistDetailsMachineContext) => async (
          send
        ) => {
          if (context.next) {
            const playlistDetails = await request<SpotifyApi.UsersSavedTracksResponse>(
              context.next
            );
            send({ type: 'RECEIVED_DATA', data: playlistDetails });
          }
        },
        fetchPlaylistDetails: async (
          context: PlaylistDetailsMachineContext
        ) => {
          const playlistDetails: SpotifyApi.PlaylistObjectFull = await request(
            `${spotifyConfig.apiUrl}/playlists/${context.id}`
          );
          return playlistDetails;
        },
      },
    }
  );

export default createPlaylistDetailsMachine;
