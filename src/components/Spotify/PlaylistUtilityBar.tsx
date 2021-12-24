import { useSelector, useService } from '@xstate/react';
import styled from 'styled-components/macro';

import PlayButton from './PlayButton';
import { Context, SelectorState, SpotifyEvent } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import { getToken } from './utils';

// check if its liked or regular
// regular -> play first track if it doesnt match currentPlaylistInfo.playlistId else play/pause the current track via currentTrackInfo

interface PlaylistUtilityBarProps {
  playlist: SpotifyApi.PlaylistObjectFull;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;

const PlaylistUtilityBar = ({ playlist }: PlaylistUtilityBarProps) => {
  const token = getToken();

  const service = useSpotifyContext();
  const [state] = useService<Context, SpotifyEvent>(service);
  const deviceId = useSelector(service, selectDeviceId);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const isLikedSongsView = state.matches('loggedIn.success.liked');
  const isSelectedPlaylistDiffFromTheOnePlaying =
    currentTrackInfo?.playlistId !== playlist.id;
  const uris = playlist?.tracks?.items.map((item) => item?.track?.uri);
  const isPlaylistPlaying =
    currentTrackInfo?.playlistId === playlist?.id &&
    !!currentTrackInfo?.isPlaying;

  const getBody = () => {
    if (isLikedSongsView) {
      return {
        uris,
        offset: { uri: currentTrackInfo?.track?.uri },
        position_ms: currentTrackInfo?.position,
      };
    }

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

export default PlaylistUtilityBar;
