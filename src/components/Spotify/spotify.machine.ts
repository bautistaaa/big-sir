import qs from 'query-string';
import { assign, createMachine, send, State } from 'xstate';

import likedSongsInfiniteScrollMachine from './liked-songs-infinite-scroll.machine';
// import infiniteScrollMachine from './infinite-scroll.machine';
import spotifyConfig from '../../shared/config';
import { request } from './utils';

export type View = 'home' | 'library' | 'search' | 'liked' | 'details';
export type SelectorState = State<Context, SpotifyEvent, any, any>;
export interface FeedData {
  newReleases: SpotifyApi.ListOfNewReleasesResponse | undefined;
  featurePlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse | undefined;
  trackRecommendations: SpotifyApi.RecommendationsFromSeedsResponse;
  topTracks: SpotifyApi.UsersTopTracksResponse;
}
export interface Context {
  token: string;
  playlists?: SpotifyApi.ListOfUsersPlaylistsResponse;
  error?: string;
  feedData?: FeedData;
  playlistDetails?: SpotifyApi.PlaylistObjectFull;
  userProfile?: SpotifyApi.UserProfileResponse;
  likedSongs?: SpotifyApi.UsersSavedTracksResponse;
  currentTrackId?: string;
  deviceId?: string;
  headerState: {
    text: string;
    opacity: number;
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
type HeaderTransitionEvent = {
  type: 'TRANSITION_HEADER';
  payload: { text: string; opacity: number; backgroundColor: string };
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
  | LibraryEvent
  | LikedEvent
  | PlayTrackEvent
  | PlayerInitEvent
  | ReceivedDataEvent
  | ScrollToBottomEvent
  | SearchEvent;

const getTopTrackIds = (topTracks: SpotifyApi.TrackObjectFull[]): string => {
  const spotifyIds = topTracks.slice(0, 4).map((tt) => tt.id);
  return spotifyIds.join(',');
};
const query = {
  time_range: 'medium_term',
  limit: 50,
};
const defaultHeaderState = {
  opacity: 0,
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
          opacity: (event as HeaderTransitionEvent).payload.opacity,
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
    fetchUserData: async () => {
      const userProfile = await request<SpotifyApi.UserProfileResponse>(
        `${spotifyConfig.apiUrl}/me`
      );
      const playlists: SpotifyApi.ListOfUsersPlaylistsResponse = await request(
        `${spotifyConfig.apiUrl}/users/${userProfile.id}/playlists?offset=0&limit=50`
      );
      return [userProfile, playlists];
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
        view: 'home',
        headerState: defaultHeaderState,
        token,
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
            view: 'home',
            headerState: defaultHeaderState,
            token,
            error: '',
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
                      actions: assign<Context, any>({
                        feedData: (_, event) => event.data,
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
                      context: {
                        view: 'liked',
                        headerState: defaultHeaderState,
                        token,
                        error: '',
                        playlistDetails: undefined,
                      },
                      invoke: {
                        id: 'likedSongsInfiniteScrollMachine',
                        src: likedSongsInfiniteScrollMachine,
                      },
                      on: {
                        LIBRARY: { target: '#library' },
                        HOME: { target: '#home' },
                        DETAILS: { target: '#details' },
                        SEARCH: { target: '#search' },
                        PLAY_TRACK: {
                          actions: ['playTrack'],
                        },
                        SCROLL_TO_BOTTOM: {
                          actions: send(
                            { type: 'SCROLL_TO_BOTTOM' },
                            {
                              to: 'likedSongsInfiniteScrollMachine',
                            }
                          ),
                        },
                        // @ts-ignore
                        RECEIVED_DATA: {
                          actions: assign<Context, any>({
                            view: 'liked',
                            likedSongs: (_, event) => {
                              console.log(event.data.likedSongs);
                              // @ts-ignore
                              return event.data.likedSongs;
                            },
                            playlistDetails: undefined,
                          }),
                        },
                      },
                    },
                    details: {
                      id: 'details',
                      initial: 'loading',
                      states: {
                        loading: {
                          // @ts-ignore
                          invoke: {
                            src: 'fetchPlaylistDetails',
                            onDone: {
                              target: 'detailsView',
                              actions: assign<Context, any>({
                                playlistDetails: (_, event) => event.data,
                                view: 'details',
                              }),
                            },
                            onError: {
                              target: 'detailsFailure',
                              actions: assign<Context, any>({
                                error: (_, event) => event.data,
                              }),
                            },
                          },
                        },
                        detailsView: {
                          on: {
                            LIBRARY: { target: '#library' },
                            LIKED: { target: '#liked' },
                            HOME: { target: '#home' },
                            DETAILS: { target: '#details' },
                            SEARCH: { target: '#search' },
                            PLAY_TRACK: {
                              actions: ['playTrack'],
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
