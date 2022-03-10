import { assign, createMachine, State } from 'xstate';

import spotifyConfig from '../../shared/config';
import { request } from './utils';

interface CurrentTrackInfo {
  trackId: string;
  track: Spotify.Track;
  isPlaying: boolean;
  listId: string;
  position: number;
}
interface CurrentPlaylistInfo {
  playlist: SpotifyApi.PlaylistObjectFull;
  isPlaying: boolean;
}
interface CurrentAlbumInfo {
  album: SpotifyApi.SingleAlbumResponse;
  isPlaying: boolean;
}
interface CurrentArtistInfo {
  artist: SpotifyApi.SingleArtistResponse;
  isPlaying: boolean;
}
export type View =
  | 'artist'
  | 'home'
  | 'library'
  | 'search'
  | 'liked'
  | 'playlist'
  | 'album';
export type SelectorState = State<Context, SpotifyEvent, any, any>;
export interface Context {
  currentListId?: string;
  currentTrack?: CurrentTrackInfo;
  currentAlbumInfo?: CurrentAlbumInfo;
  currentArtistInfo?: CurrentArtistInfo;
  currentPlaylistInfo?: CurrentPlaylistInfo;
  playlists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  error?: string;
  userProfile?: SpotifyApi.UserProfileResponse;
  deviceId: string;
  headerState: {
    text: string;
    backgroundColor: string;
  };
  view?: View;
}

type ArtistEvent = {
  type: 'ARTIST';
  payload: { artistId: string; view: View };
};
type ArtistUpdateEvent = {
  type: 'ARTIST_UPDATE';
  payload: { artist: SpotifyApi.SingleArtistResponse; isPlaying: boolean };
};
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
type AlbumEvent = {
  type: 'ALBUM';
  payload: { albumId: string; view: View };
};
type AlbumUpdateEvent = {
  type: 'ALBUM_UPDATE';
  payload: { album: SpotifyApi.SingleAlbumResponse; isPlaying: boolean };
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
type LoggedOutEvent = {
  type: 'LOG_OUT';
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
  | AlbumEvent
  | AlbumUpdateEvent
  | ArtistEvent
  | ArtistUpdateEvent
  | HeaderTransitionEvent
  | HomeEvent
  | JwtInvalidEvent
  | JwtValidEvent
  | LibraryEvent
  | LikedEvent
  | LoggedOutEvent
  | PlaylistEvent
  | PlayerInitEvent
  | PlaylistUpdateEvent
  | ReceivedDataEvent
  | ScrollToBottomEvent
  | SearchEvent
  | UpdateTrackEvent;

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
      headerState: (_, event: HeaderTransitionEvent) => {
        return {
          backgroundColor: event.payload.backgroundColor,
          text: event.payload.text,
        };
      },
    }),
    updateTrack: assign<Context, any>({
      currentTrack: (_, event: UpdateTrackEvent) => {
        return {
          trackId: event.payload.trackId,
          track: event.payload.track,
          isPlaying: event.payload.isPlaying,
          listId: event.payload.playlistId,
          position: event.payload.position,
        };
      },
    }),
    playerInit: assign<Context, any>({
      deviceId: (_, event: PlayerInitEvent) => event.payload.deviceId,
    }),
    playlistUpdate: assign<Context, any>({
      currentPlaylistInfo: (_, event: PlaylistUpdateEvent) => {
        return {
          playlist: event.payload.playlist,
          isPlaying: event.payload.isPlaying,
        };
      },
    }),
    albumUpdate: assign<Context, any>({
      currentAlbumInfo: (_, event: AlbumUpdateEvent) => {
        return {
          album: event.payload.album,
          isPlaying: event.payload.isPlaying,
        };
      },
    }),
    artistUpdate: assign<Context, any>({
      currentArtistInfo: (_, event: ArtistUpdateEvent) => {
        return {
          artist: event.payload.artist,
          isPlaying: event.payload.isPlaying,
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
      deviceId: '',
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
        on: {
          TRANSITION_HEADER: {
            actions: 'transitionHeader',
          },
          LOG_OUT: 'loggedOut',
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
                  ALBUM: { target: '#album' },
                  ARTIST: { target: '#artist' },
                  PLAYLIST: 'playlist',
                  SEARCH: 'search',
                  LIBRARY: 'library',
                  LIKED: 'liked',
                },
              },
              search: {
                id: 'search',
                entry: [
                  assign<Context, any>({
                    headerState: {
                      backgroundColor: 'rgb(18, 18, 18);',
                      text: 'search',
                    },
                    currentListId: undefined,
                  }),
                  'changeView',
                ],
                on: {
                  ALBUM: { target: '#album' },
                  ARTIST: { target: '#artist' },
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
                  ALBUM: { target: '#album' },
                  ARTIST: { target: '#artist' },
                  PLAYLIST: 'playlist',
                  HOME: 'home',
                  LIBRARY: 'library',
                  SEARCH: 'search',
                },
              },
              album: {
                id: 'album',
                entry: [
                  'changeView',
                  assign<Context, any>({
                    currentListId: (_, event: AlbumEvent) =>
                      event?.payload?.albumId,
                  }),
                ],
                on: {
                  ARTIST: { target: '#artist' },
                  LIBRARY: { target: '#library' },
                  LIKED: { target: '#liked' },
                  HOME: { target: '#home' },
                  PLAYLIST: { target: '#playlist' },
                  SEARCH: { target: '#search' },
                  PLAYLIST_UPDATE: {
                    actions: 'playlistUpdate',
                  },
                  ALBUM_UPDATE: {
                    actions: 'albumUpdate',
                  },
                  ARTIST_UPDATE: {
                    actions: 'artistUpdate',
                  },
                },
              },
              artist: {
                id: 'artist',
                entry: [
                  'changeView',
                  assign<Context, any>({
                    currentListId: (_, event: ArtistEvent) =>
                      event?.payload?.artistId,
                    headerState: {
                      backgroundColor: 'rgb(18, 18, 18);',
                      text: 'artist',
                    },
                  }),
                ],
                on: {
                  ALBUM: { target: '#album' },
                  LIBRARY: { target: '#library' },
                  LIKED: { target: '#liked' },
                  HOME: { target: '#home' },
                  PLAYLIST: { target: '#playlist' },
                  SEARCH: { target: '#search' },
                  PLAYLIST_UPDATE: {
                    actions: 'playlistUpdate',
                  },
                  ALBUM_UPDATE: {
                    actions: 'albumUpdate',
                  },
                  ARTIST_UPDATE: {
                    actions: 'artistUpdate',
                  },
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
                  ALBUM: { target: '#album' },
                  LIBRARY: { target: '#library' },
                  LIKED: { target: '#liked' },
                  HOME: { target: '#home' },
                  PLAYLIST: { target: '#playlist' },
                  SEARCH: { target: '#search' },
                  PLAYLIST_UPDATE: {
                    actions: 'playlistUpdate',
                  },
                  ALBUM_UPDATE: {
                    actions: 'albumUpdate',
                  },
                  ARTIST_UPDATE: {
                    actions: 'artistUpdate',
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
