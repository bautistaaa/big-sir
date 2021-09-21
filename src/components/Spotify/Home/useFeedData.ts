import { useEffect, useState } from 'react';
import qs from 'query-string';

import spotifyConfig from '../../../shared/config';
import { request } from '../utils';

export interface FeedData {
  newReleases: SpotifyApi.ListOfNewReleasesResponse;
  featurePlaylists: SpotifyApi.ListOfFeaturedPlaylistsResponse;
  topTracks: SpotifyApi.UsersTopTracksResponse;
  trackRecommendations: SpotifyApi.RecommendationsFromSeedsResponse;
}

const query = {
  time_range: 'medium_term',
  limit: 50,
};
const getTopTrackIds = (topTracks: SpotifyApi.TrackObjectFull[]): string => {
  const spotifyIds = topTracks.slice(0, 4).map((tt) => tt.id);
  return spotifyIds.join(',');
};

const useFeedData = () => {
  const [data, setData] = useState<FeedData | undefined>();

  useEffect(() => {
    const fetch = async () => {
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

      const results = {
        newReleases,
        featurePlaylists,
        trackRecommendations,
        topTracks,
      };

      setData(results);
    };

    fetch();
  }, []);

  return data;
};

export default useFeedData;
