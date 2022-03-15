import { assign, createMachine } from 'xstate';
import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

export interface FeedData {
  newReleases: SpotifyApi.ListOfNewReleasesResponse;
  featurePlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse;
}

export interface HomeMachineContext {
  data: FeedData | undefined;
}

const homeMachine = createMachine<HomeMachineContext>(
  {
    id: 'home',
    initial: 'loading',
    context: {
      data: undefined,
    },
    states: {
      loading: {
        entry: () => console.log('entry'),
        invoke: {
          src: 'fetchFeedData',
          onDone: {
            target: 'success',
            actions: [
              () => console.log('actions'),
              assign({
                data: (_, event) => event.data,
              }),
            ],
          },
        },
      },
      success: { type: 'final' },
      error: {},
    },
  },
  {
    services: {
      fetchFeedData: async () => {
        console.log('fetch feed data');
        const newReleasesPromise: Promise<SpotifyApi.ListOfNewReleasesResponse> = request(
          `${spotifyConfig.apiUrl}/browse/new-releases?limit=12&country=US`
        );
        const featuredPlaylistsPromise: Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse> = request(
          `${spotifyConfig.apiUrl}/browse/featured-playlists`
        );
        const [newReleases, featurePlaylists] = await Promise.all([
          newReleasesPromise,
          featuredPlaylistsPromise,
        ]);

        console.log('feed data fetched');
        return {
          newReleases,
          featurePlaylists,
        };
      },
    },
  }
);

export default homeMachine;
