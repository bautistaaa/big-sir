import { useEffect, useState } from 'react';

import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

export interface FeedData {
  newReleases: SpotifyApi.ListOfNewReleasesResponse;
  featurePlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse;
}

const useFeedData = () => {
  const [data, setData] = useState<FeedData | undefined>();

  useEffect(() => {
    const fetch = async () => {
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

      const results = {
        newReleases,
        featurePlaylists,
      };

      setData(results);
    };

    fetch();
  }, []);

  return data;
};

export default useFeedData;
