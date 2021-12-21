import { assign, createMachine, State } from 'xstate';

import spotifyConfig from '../../shared/config';
import { request } from './utils';

export type View = 'home' | 'library' | 'search' | 'liked' | 'details';
export type SelectorState = State<Context, SpotifyEvent, any, any>;
export interface Context {
  currentPlaylistId?: string;
  playlists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  error?: string;
  userProfile?: SpotifyApi.UserProfileResponse;
  currentTrackId?: string;
  deviceId?: string;
  headerState: {
    text: string;
    backgroundColor: string;
  };
  view?: View;
}

type HomeEvent = {
  type: 'HOME';
  payload: { view: View };
};
type SearchEvent = {
  type: 'SEARCH';
  payload: { view: View };
};
type LibraryEvent = {
  type: 'LIBRARY';
  payload: { view: View };
};
type LikedEvent = {
  type: 'LIKED';
  payload: { view: View };
};
type DetailsEvent = {
  type: 'DETAILS';
  payload: { playlistId: string };
};
type JwtInvalidEvent = {
  type: 'JWT_INVALID';
};
type JwtValidEvent = {
  type: 'JWT_VALID';
};
type HeaderTransitionEvent = {
  type: 'TRANSITION_HEADER';
  payload: { text: string; backgroundColor: string };
};
type PlayTrackEvent = {
  type: 'PLAY_TRACK';
  payload: { id: string };
};
type PlayerInitEvent = {
  type: 'PLAYER_INIT';
  payload: { deviceId: string };
};
type ReceivedDataEvent = {
  type: 'RECEIVED_DATA';
  data: SpotifyApi.UsersSavedTracksResponse;
};
type ScrollToBottomEvent = {
  type: 'SCROLL_TO_BOTTOM';
};

export type SpotifyEvent =
  | DetailsEvent
  | HeaderTransitionEvent
  | HomeEvent
  | JwtInvalidEvent
  | JwtValidEvent
  | LibraryEvent
  | LikedEvent
  | PlayTrackEvent
  | PlayerInitEvent
  | ReceivedDataEvent
  | ScrollToBottomEvent
  | SearchEvent;

const defaultHeaderState = {
  backgroundColor: 'transparent',
  text: '',
};

const config = {
  actions: {
    changeView: assign<Context, any>({
      view: (_, event) => event?.payload?.view ?? 'home',
    }),
    transitionHeader: assign<Context, any>({
      headerState: (_, event) => {
        return {
          backgroundColor: (event as HeaderTransitionEvent).payload
            .backgroundColor,
          text: (event as HeaderTransitionEvent).payload.text,
        };
      },
    }),
    playTrack: assign<Context, any>({
      currentTrackId: (_, event) => (event as PlayTrackEvent).payload.id,
    }),
    playerInit: assign<Context, any>({
      deviceId: (_, event) => (event as PlayerInitEvent).payload.deviceId,
    }),
  },
  services: {
    fetchUserData: async () => {
      const userProfile = await request<SpotifyApi.UserProfileResponse>(
        `${spotifyConfig.apiUrl}/me`
      );
      const playlists: SpotifyApi.ListOfUsersPlaylistsResponse = await request(
        `${spotifyConfig.apiUrl}/users/${userProfile.id}/playlists?offset=0&limit=50`
      );
      return [userProfile, playlists];
    },
  },
};
const spotifyMachine = createMachine<Context, SpotifyEvent>(
  {
    id: 'spotify',
    initial: 'checkIfLoggedIn',
    context: {
      view: 'home',
      headerState: defaultHeaderState,
      error: '',
    },
    strict: true,
    states: {
      checkIfLoggedIn: {
        on: {
          JWT_VALID: {
            target: 'loggedIn',
          },
          JWT_INVALID: {
            target: 'loggedOut',
          },
        },
        invoke: {
          src: 'checkedIfLoggedIn',
        },
      },
      loggedIn: {
        initial: 'loading',
        context: {
          view: 'home',
          headerState: defaultHeaderState,
          error: '',
        },
        on: {
          TRANSITION_HEADER: {
            actions: ['transitionHeader'],
          },
        },
        states: {
          loading: {
            invoke: {
              src: 'fetchUserData',
              onDone: {
                target: 'success',
                actions: assign<Context, any>({
                  userProfile: (_, event) => event.data[0],
                  playlists: (_, event) => event.data[1],
                }),
              },
              onError: {
                target: 'failure',
                actions: assign<Context, any>({
                  error: (_, event) => event.data,
                }),
              },
            },
          },
          failure: {},
          success: {
            initial: 'home',
            on: {
              PLAYER_INIT: {
                actions: ['playerInit'],
              },
            },
            states: {
              home: {
                id: 'home',
                entry: 'changeView',
                on: {
                  DETAILS: 'details',
                  SEARCH: 'search',
                  LIBRARY: 'library',
                  LIKED: 'liked',
                },
              },
              search: {
                id: 'search',
                entry: 'changeView',
                on: {
                  DETAILS: 'details',
                  HOME: 'home',
                  LIBRARY: 'library',
                  LIKED: 'liked',
                },
              },
              library: {
                id: 'library',
                entry: 'changeView',
                on: {
                  DETAILS: 'details',
                  HOME: 'home',
                  LIKED: 'liked',
                  SEARCH: 'search',
                },
              },
              liked: {
                id: 'liked',
                entry: [
                  assign<Context, any>({
                    headerState: {
                      backgroundColor: 'rgb(30 21 62)',
                      text: 'Liked Songs',
                    },
                  }),
                  'changeView',
                ],
                on: {
                  DETAILS: 'details',
                  HOME: 'home',
                  LIBRARY: 'library',
                  SEARCH: 'search',
                  PLAY_TRACK: {
                    actions: 'playTrack',
                  },
                },
              },
              details: {
                id: 'details',
                entry: [
                  'changeView',
                  assign<Context, any>({
                    currentPlaylistId: (_, event) => event?.payload?.playlistId,
                  }),
                ],
                on: {
                  LIBRARY: { target: '#library' },
                  LIKED: { target: '#liked' },
                  HOME: { target: '#home' },
                  DETAILS: { target: '#details' },
                  SEARCH: { target: '#search' },
                  PLAY_TRACK: {
                    actions: 'playTrack',
                  },
                },
              },
            },
          },
        },
      },
      loggedOut: {},
    },
  },
  config
);

export default spotifyMachine;
