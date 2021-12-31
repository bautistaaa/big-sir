import { assign, createMachine, State } from 'xstate';

import spotifyConfig from '../../shared/config';
import { request } from './utils';

interface CurrentTrackInfo {
  trackId: string;
  track: Spotify.Track;
  isPlaying: boolean;
  playlistId: string;
  position: number;
}
interface CurrentPlaylistInfo {
  playlist: SpotifyApi.PlaylistObjectFull;
  isPlaying: boolean;
}
export type View = 'home' | 'library' | 'search' | 'liked' | 'playlist';
export type SelectorState = State<Context, SpotifyEvent, any, any>;
export interface Context {
  currentListId?: string;
  currentTrack?: CurrentTrackInfo;
  currentPlaylistInfo?: CurrentPlaylistInfo;
  playlists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  error?: string;
  userProfile?: SpotifyApi.UserProfileResponse;
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
type PlaylistEvent = {
  type: 'PLAYLIST';
  payload: { playlistId: string; view: View };
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
type UpdateTrackEvent = {
  type: 'UPDATE_TRACK';
  payload: {
    trackId: string;
    track: Spotify.Track;
    isPlaying: boolean;
    playlistId: string;
    position: number;
  };
};
type PlayerInitEvent = {
  type: 'PLAYER_INIT';
  payload: { deviceId: string };
};
type PlaylistUpdateEvent = {
  type: 'PLAYLIST_UPDATE';
  payload: { playlist: SpotifyApi.PlaylistObjectFull; isPlaying: boolean };
};
type ReceivedDataEvent = {
  type: 'RECEIVED_DATA';
  data: SpotifyApi.UsersSavedTracksResponse;
};
type ScrollToBottomEvent = {
  type: 'SCROLL_TO_BOTTOM';
};

export type SpotifyEvent =
  | PlaylistEvent
  | HeaderTransitionEvent
  | HomeEvent
  | JwtInvalidEvent
  | JwtValidEvent
  | LibraryEvent
  | LikedEvent
  | PlaylistUpdateEvent
  | UpdateTrackEvent
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
      view: (_, event) => event?.payload?.view,
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
    updateTrack: assign<Context, any>({
      currentTrack: (_, event) => {
        return {
          trackId: (event as UpdateTrackEvent).payload.trackId,
          track: (event as UpdateTrackEvent).payload.track,
          isPlaying: (event as UpdateTrackEvent).payload.isPlaying,
          playlistId: (event as UpdateTrackEvent).payload.playlistId,
          position: (event as UpdateTrackEvent).payload.position,
        };
      },
    }),
    playerInit: assign<Context, any>({
      deviceId: (_, event) => (event as PlayerInitEvent).payload.deviceId,
    }),
    playlistUpdate: assign<Context, any>({
      currentPlaylistInfo: (_, event) => {
        return {
          playlist: (event as PlaylistUpdateEvent).payload.playlist,
          isPlaying: (event as PlaylistUpdateEvent).payload.isPlaying,
        };
      },
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
            actions: 'transitionHeader',
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
                actions: 'playerInit',
              },
              UPDATE_TRACK: {
                actions: 'updateTrack',
              },
            },
            states: {
              home: {
                id: 'home',
                entry: 'changeView',
                on: {
                  PLAYLIST: 'playlist',
                  SEARCH: 'search',
                  LIBRARY: 'library',
                  LIKED: 'liked',
                },
              },
              search: {
                id: 'search',
                entry: 'changeView',
                on: {
                  PLAYLIST: 'playlist',
                  HOME: 'home',
                  LIBRARY: 'library',
                  LIKED: 'liked',
                },
              },
              library: {
                id: 'library',
                entry: 'changeView',
                on: {
                  PLAYLIST: 'playlist',
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
                    currentListId: undefined,
                  }),
                  'changeView',
                ],
                on: {
                  PLAYLIST: 'playlist',
                  HOME: 'home',
                  LIBRARY: 'library',
                  SEARCH: 'search',
                },
              },
              playlist: {
                id: 'playlist',
                entry: [
                  'changeView',
                  assign<Context, any>({
                    currentListId: (_, event) => event?.payload?.playlistId,
                  }),
                ],
                on: {
                  LIBRARY: { target: '#library' },
                  LIKED: { target: '#liked' },
                  HOME: { target: '#home' },
                  PLAYLIST: { target: '#playlist' },
                  SEARCH: { target: '#search' },
                  PLAYLIST_UPDATE: {
                    actions: 'playlistUpdate',
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
