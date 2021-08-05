import { assign, createMachine, sendParent } from 'xstate';

export interface InfiniteScrollMachineContext {
  likedSongs?: SpotifyApi.UsersSavedTracksResponse;
  next?: string;
  errorMessage?: string;
}

export type InfiniteScrollMachineEvent =
  | {
      type: 'SCROLL_TO_BOTTOM';
    }
  | {
      type: 'RECEIVED_DATA';
      data: SpotifyApi.UsersSavedTracksResponse;
    };

const infiniteScrollMachine = createMachine<
  InfiniteScrollMachineContext,
  InfiniteScrollMachineEvent
>(
  {
    id: 'infiniteScroll',
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
            actions: [
              'assignDataToContext',
              sendParent((context, event) => {
                console.log('sendParent');
                console.log({ event, context });
                return {
                  type: 'RECEIVED_DATA',
                  data: {
                    likedSongs: context.likedSongs,
                  },
                };
              }),
            ],
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
        console.log({ context });
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
  }
);

export default infiniteScrollMachine;
