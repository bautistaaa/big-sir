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
type FetchEvent = {
  type: 'FETCH';
};
type ResolveEvent = {
  type: 'RESOLVE';
  payload: { data: SpotifyApi.ListOfUsersPlaylistsResponse };
};

export type SpotifyEvent =
  | FetchEvent
  | ResolveEvent
  | HomeEvent
  | LibraryEvent
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
    resolve: assign<Context, ResolveEvent>((context, event) => {
      return {
        ...context,
        playlists: event.payload.data,
      };
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
        `${spotifyConfig.apiUrl}/users/${id}/playlists?offset=0&limit=20`
      );
      return playlists;
    },
  },
};
const createSpotifyMachine = (token: string) =>
  createMachine<Context, SpotifyEvent, any>(
    {
      id: 'spotify',
      initial: 'boot',
      context: {
        token,
        playlists: undefined,
        feedData: undefined,
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
            token,
            playlists: undefined,
            feedData: undefined,
            error: '',
          },
          states: {
            idle: {
              on: { FETCH: 'loading' },
            },
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
                  states: {
                    home: {
                      on: { LIBRARY: 'library', SEARCH: 'search' },
                    },
                    search: { on: { LIBRARY: 'library', HOME: 'home' } },
                    library: { on: { SEARCH: 'search', HOME: 'home' } },
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
    config as any
  );

export default createSpotifyMachine;
