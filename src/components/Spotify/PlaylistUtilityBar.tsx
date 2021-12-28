import { useSelector } from '@xstate/react';
import { memo } from 'react';
import styled from 'styled-components/macro';

import PlayButton from './PlayButton';
import { SelectorState } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import { getToken } from './utils';

interface PlaylistUtilityBarProps {
  playlist: SpotifyApi.PlaylistObjectFull;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;

const PlaylistUtilityBar = ({ playlist }: PlaylistUtilityBarProps) => {
  const token = getToken();

  const service = useSpotifyContext();
  const deviceId = useSelector(service, selectDeviceId);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const isSelectedPlaylistDiffFromTheOnePlaying =
    currentTrackInfo?.playlistId !== playlist?.id;
  const isPlaylistPlaying =
    currentTrackInfo?.playlistId === playlist?.id &&
    !!currentTrackInfo?.isPlaying;

  const getBody = () => {
    const firstSong = playlist.tracks.items[0].track.uri;
    if (isSelectedPlaylistDiffFromTheOnePlaying) {
      return {
        context_uri: playlist.uri,
        offset: { uri: firstSong },
        position_ms: 0,
      };
    }

    return {
      context_uri: playlist.uri,
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

// export default PlaylistUtilityBar;
export default memo(PlaylistUtilityBar);
