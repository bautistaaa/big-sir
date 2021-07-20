import { assign, createMachine } from 'xstate';
import qs from 'query-string';
import spotifyConfig from '../../shared/config';
import { request } from './utils';

export interface FeedData {
  newReleases: SpotifyApi.ListOfNewReleasesResponse | undefined;
  featurePlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | undefined;
  trackRecommendations: SpotifyApi.RecommendationsFromSeedsResponse;
  topTracks: SpotifyApi.UsersTopTracksResponse;
}
export interface Context {
  token: string;
  playlists: SpotifyApi.ListOfUsersPlaylistsResponse | undefined;
  error?: string;
  feedData: FeedData | undefined;
  playlistDetails: SpotifyApi.PlaylistObjectFull | undefined;
  currentTrackId?: string;
  deviceId?: string;
  headerState: {
    playlistName?: string;
    opacity?: number;
    backgroundColor: string;
  };
}

type HomeEvent = {
  type: 'HOME';
};
type SearchEvent = {
  type: 'SEARCH';
};
type LibraryEvent = {
  type: 'LIBRARY';
};
type DetailsEvent = {
  type: 'DETAILS';
  payload: { playlistId: string };
};
type HeaderTransitionEvent = {
  type: 'TRANSITION_HEADER';
  payload: { playlistName?: string; opacity?: number; backgroundColor: string };
};
type PlayTrackEvent = {
  type: 'PLAY_TRACK';
  payload: { id: string };
};
type PlayerInitEvent = {
  type: 'PLAYER_INIT';
  payload: { deviceId: string };
};

export type SpotifyEvent =
  | DetailsEvent
  | HeaderTransitionEvent
  | HomeEvent
  | LibraryEvent
  | PlayTrackEvent
  | PlayerInitEvent
  | SearchEvent;

const getTopTrackIds = (topTracks: SpotifyApi.TrackObjectFull[]): string => {
  const spotifyIds = topTracks.slice(0, 4).map((tt) => tt.id);
  return spotifyIds.join(',');
};
const query = {
  time_range: 'medium_term',
  limit: 50,
};

const config = {
  actions: {
    transitionHeader: assign<Context, any>({
      headerState: (_, event) => {
        return {
          opacity: (event as HeaderTransitionEvent).payload.opacity,
          backgroundColor: (event as HeaderTransitionEvent).payload
            .backgroundColor,
          playlistName: (event as HeaderTransitionEvent).payload.playlistName,
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
    fetchFeedData: async () => {
      const newReleasesPromise: Promise<SpotifyApi.ListOfNewReleasesResponse> = request(
        `${spotifyConfig.apiUrl}/browse/new-releases?limit=12`
      );
      const featuredPlaylistsPromise: Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse> = request(
        `${spotifyConfig.apiUrl}/browse/featured-playlists`
      );
      const topTracksPromise: Promise<SpotifyApi.UsersTopTracksResponse> = request(
        `${spotifyConfig.apiUrl}/me/top/tracks?${qs.stringify(query)}`
      );

      const [newReleases, featurePlaylists, topTracks] = await Promise.all([
        newReleasesPromise,
        featuredPlaylistsPromise,
        topTracksPromise,
      ]);

      const topTracksIds = getTopTrackIds(topTracks.items);
      const trackRecommendations: SpotifyApi.RecommendationsFromSeedsResponse = await request(
        `${
          spotifyConfig.apiUrl
        }/recommendations?seed_tracks=${encodeURIComponent(topTracksIds)}`
      );

      return { newReleases, featurePlaylists, trackRecommendations, topTracks };
    },
    fetchUserPlaylists: async () => {
      const { id } = await request(`${spotifyConfig.apiUrl}/me`);
      const playlists: SpotifyApi.ListOfUsersPlaylistsResponse = await request(
        `${spotifyConfig.apiUrl}/users/${id}/playlists?offset=0&limit=50`
      );
      return playlists;
    },
    fetchPlaylistDetails: async (_: Context, e: any) => {
      const {
        payload: { playlistId },
      } = e as DetailsEvent;
      const playlistDetails: SpotifyApi.PlaylistObjectFull = await request(
        `${spotifyConfig.apiUrl}/playlists/${playlistId}`
      );
      return playlistDetails;
    },
  },
};
const createSpotifyMachine = (token: string) =>
  createMachine<Context, SpotifyEvent>(
    {
      id: 'spotify',
      initial: 'boot',
      context: {
        headerState: { opacity: 0, backgroundColor: 'transparent' },
        token,
        playlists: undefined,
        feedData: undefined,
        playlistDetails: undefined,
        error: '',
      },
      strict: true,
      states: {
        boot: {
          on: {
            '': [
              {
                cond: (extState) => {
                  return !!extState.token;
                },
                target: 'loggedIn',
              },
              { target: 'loggedOut' },
            ],
          },
        },
        loggedIn: {
          initial: 'loading',
          context: {
            headerState: { opacity: 0, backgroundColor: 'transparent' },
            token,
            playlists: undefined,
            feedData: undefined,
            playlistDetails: undefined,
            error: '',
          },
          states: {
            loading: {
              invoke: {
                src: 'fetchUserPlaylists',
                onDone: {
                  target: 'success',
                  actions: assign({
                    playlists: (_, event) => event.data,
                  }),
                },
                onError: {
                  target: 'failure',
                  actions: assign({
                    error: (_, event) => event.data,
                  }),
                },
              },
            },
            failure: {},
            success: {
              initial: 'init',
              on: {
                PLAYER_INIT: {
                  actions: ['playerInit'],
                },
              },
              states: {
                init: {
                  invoke: {
                    src: 'fetchFeedData',
                    onDone: {
                      target: 'success',
                      actions: assign({
                        feedData: (_, event) => event.data,
                      }),
                    },
                    onError: {
                      target: 'failure',
                      actions: assign({
                        error: (_, event) => event.data,
                      }),
                    },
                  },
                },
                success: {
                  initial: 'home',
                  on: {
                    TRANSITION_HEADER: {
                      actions: ['transitionHeader'],
                    },
                  },
                  states: {
                    home: {
                      id: 'home',
                      on: {
                        LIBRARY: 'library',
                        SEARCH: 'search',
                        DETAILS: 'details',
                      },
                    },
                    search: {
                      id: 'search',
                      on: {
                        LIBRARY: 'library',
                        HOME: 'home',
                        DETAILS: 'details',
                      },
                    },
                    library: {
                      id: 'library',
                      on: {
                        SEARCH: 'search',
                        HOME: 'home',
                        DETAILS: 'details',
                      },
                    },
                    details: {
                      id: 'details',
                      initial: 'loading',
                      states: {
                        loading: {
                          invoke: {
                            src: 'fetchPlaylistDetails',
                            onDone: {
                              target: 'detailsView',
                              actions: assign({
                                playlistDetails: (_, event) => event.data,
                              }),
                            },
                            onError: {
                              target: 'detailsFailure',
                              actions: assign({
                                error: (_, event) => event.data,
                              }),
                            },
                          },
                        },
                        detailsView: {
                          on: {
                            LIBRARY: { target: '#library' },
                            HOME: { target: '#home' },
                            DETAILS: { target: '#details' },
                            PLAY_TRACK: {
                              actions: [
                                'playTrack',
                                (c, e) => console.log('doodoo'),
                              ],
                            },
                          },
                        },
                        detailsFailure: {},
                      },
                    },
                  },
                },
                failure: {},
              },
            },
          },
        },
        loggedOut: {},
      },
    },
    config
  );

export default createSpotifyMachine;
