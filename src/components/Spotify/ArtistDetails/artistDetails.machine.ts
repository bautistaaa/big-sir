import { assign, createMachine } from 'xstate';

import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

export interface ArtistDetailsMachineContext {
  id: string;
  error?: string;
  artistDetails?: SpotifyApi.SingleArtistResponse;
  artistAlbums?: SpotifyApi.ArtistsAlbumsResponse;
}

export type ArtistDetailsEvent = {
  type: 'RECEIVED_DATA';
  data: SpotifyApi.SingleArtistResponse;
};

const createArtistMachine = (id: string) =>
  createMachine<ArtistDetailsMachineContext, ArtistDetailsEvent>(
    {
      id: 'artist',
      initial: 'loading',
      context: {
        id,
        artistDetails: undefined,
      },
      states: {
        loading: {
          invoke: {
            src: 'fetchArtistDetails',
            onDone: {
              target: 'success',
              actions: assign<ArtistDetailsMachineContext, any>({
                artistDetails: (_, event) => event.data.artistDetails,
                artistAlbums: (_, event) => event.data.artistAlbums,
              }),
            },
            onError: {
              target: 'error',
              actions: assign<ArtistDetailsMachineContext, any>({
                error: (_, event) => event.data,
              }),
            },
          },
        },
        success: { type: 'final' },
        error: {},
      },
    },
    {
      services: {
        fetchArtistDetails: async (context: ArtistDetailsMachineContext) => {
          const artistDetailsPromise = request<SpotifyApi.SingleArtistResponse>(
            `${spotifyConfig.apiUrl}/artists/${context.id}`
          );
          const artistAlbumsPromise = request<SpotifyApi.SingleArtistResponse>(
            `${spotifyConfig.apiUrl}/artists/${context.id}/albums?limit=10`
          );

          const [artistDetails, artistAlbums] = await Promise.all([
            artistDetailsPromise,
            artistAlbumsPromise,
          ]);

          return { artistDetails, artistAlbums };
        },
      },
    }
  );

export default createArtistMachine;
