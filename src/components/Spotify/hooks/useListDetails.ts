import { useEffect, useState } from 'react';
import { request } from '../utils';
import spotifyConfig from '../../../shared/config';

const getters = {
  playlist(id: string) {
    return request<SpotifyApi.PlaylistObjectFull>(
      `${spotifyConfig.apiUrl}/playlists/${id}`
    );
  },
  album(id: string) {
    return request<SpotifyApi.SingleAlbumResponse>(
      `${spotifyConfig.apiUrl}/albums/${id}`
    );
  },
  artist(id: string) {
    return request<SpotifyApi.ArtistsTopTracksResponse>(
      `${spotifyConfig.apiUrl}/artists/${id}/top-tracks?market=US`
    );
  },
};

type Getters = typeof getters;

function useListDetails<
  T extends keyof Getters,
  R = Awaited<ReturnType<Getters[T]>>
>(type: T, listId: string): R | null {
  const [details, setDetails] = useState<R | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const data = ((await getters[type](listId)) as unknown) as R;
      setDetails(data);
    };

    fetchTracks();
  }, [listId, type]);

  return details;
}

export default useListDetails;
