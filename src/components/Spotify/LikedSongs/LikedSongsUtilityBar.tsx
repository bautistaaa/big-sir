import { useSelector } from '@xstate/react';
import styled from 'styled-components/macro';

import PlayButton from '../PlayButton';
import { SelectorState } from '../spotify.machine';
import { useSpotifyContext } from '../SpotifyContext';
import { getToken } from '../utils';

interface LikedSongsUtilityBarProps {
  likedSongs: SpotifyApi.UsersSavedTracksResponse;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;

const LikedSongsUtilityBar = ({ likedSongs }: LikedSongsUtilityBarProps) => {
  const token = getToken();

  const service = useSpotifyContext();
  const deviceId = useSelector(service, selectDeviceId);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const uris = likedSongs?.items.map((item) => item?.track?.uri);
  const isSelectedPlaylistDiffFromTheOnePlaying =
    currentTrackInfo?.playlistId !== '';
  const isPlaylistPlaying =
    currentTrackInfo?.playlistId === '' && !!currentTrackInfo?.isPlaying;

  const getBody = () => {
    const firstSong = likedSongs.items[0].track.uri;
    if (isSelectedPlaylistDiffFromTheOnePlaying) {
      return {
        uris,
        offset: { uri: firstSong },
        position_ms: 0,
      };
    }
    return {
      uris,
      offset: { uri: currentTrackInfo?.track?.uri ?? firstSong },
      position_ms: currentTrackInfo?.position,
    };
  };

  const handleUtilityPlayButtonClick = () => {
    const playOrPause = async () => {
      let method;
      if (isSelectedPlaylistDiffFromTheOnePlaying) {
        method = 'play';
      } else {
        method = currentTrackInfo?.isPlaying ? 'pause' : 'play';
      }
      try {
        const resp = await fetch(
          `https://api.spotify.com/v1/me/player/${method}?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify(getBody()),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resp.ok) {
          throw new Error('shit!');
        }
        // onPlay(track.id);
      } catch (e) {
        console.error(e);
      }
    };

    playOrPause();
  };

  return (
    <Wrapper>
      <UtilityButtonWrapper>
        <PlayButton
          onClick={handleUtilityPlayButtonClick}
          isPlaying={isPlaylistPlaying}
          size="large"
          type="default"
        />
      </UtilityButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 32px;
`;

const UtilityButtonWrapper = styled.div`
  margin-right: 24px;
`;

export default LikedSongsUtilityBar;
