import { useSelector } from '@xstate/react';
import { IoIosPause } from 'react-icons/io';
import { BiPlay } from 'react-icons/bi';

import BaseClearButton from '../../../components/ClearButton';
import { oneLine } from '../../../shared/mixins';
import { convertMsToMinutesAndSeconds } from '../../../utils';
import styled from 'styled-components';
import { getToken } from '../utils';
import { SelectorState } from '../spotify.machine';
import { useSpotifyContext } from '../SpotifyContext';

interface SongProps {
  song: SpotifyApi.TrackObjectFull;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
const Song = ({ song }: SongProps) => {
  const token = getToken();
  const service = useSpotifyContext();
  const currentTrack = useSelector(service, selectCurrentTrack);
  const deviceId = useSelector(service, selectDeviceId);
  const isPlaying = currentTrack?.trackId === song.id && currentTrack.isPlaying;

  const handleTrackStatus = (
    track: SpotifyApi.TrackObjectSimplified,
    play: boolean,
    reset: boolean
  ) => {
    const playOrPause = async () => {
      const method = play ? 'play' : 'pause';
      const body = {
        uris: [track?.uri],
        offset: { uri: track?.uri },
        position_ms:
          currentTrack?.trackId !== song.id || reset
            ? 0
            : currentTrack?.position,
      };
      try {
        const resp = await fetch(
          `https://api.spotify.com/v1/me/player/${method}?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resp.ok) {
          throw new Error('shit!');
        }
      } catch (e) {
        console.error(e);
      }
    };

    playOrPause();
  };

  return (
    <ListItem
      key={song.id}
      onDoubleClick={() => handleTrackStatus(song, true, true)}
    >
      <Left>
        <ImageWrapper>
          <img src={song.album?.images?.[2]?.url} alt="album art" />
          <ClearButton
            onClick={(e) => {
              e.stopPropagation();
              handleTrackStatus(song, !isPlaying, false);
            }}
          >
            {isPlaying ? (
              <IoIosPause fill={'white'} size={20} />
            ) : (
              <BiPlay fill={'white'} size={25} />
            )}
          </ClearButton>
        </ImageWrapper>
        <Metadata>
          <SongName>{song.name}</SongName>
          <Artist>{song.artists?.[0]?.name}</Artist>
        </Metadata>
      </Left>
      <Right>
        <SongLength>
          {convertMsToMinutesAndSeconds(song.duration_ms)}
        </SongLength>
      </Right>
    </ListItem>
  );
};

const ClearButton = styled(BaseClearButton)`
  opacity: 0;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Label = styled.div`
  font-weight: 400;
  letter-spacing: 0.4px;
  text-transform: none;
  ${oneLine}
`;
const ListItem = styled.div`
  display: grid;
  grid-gap: 16px;
  padding: 0 16px;
  grid-template-columns: [first] 4fr [last] 1fr;
  border: 1px solid transparent;
  border-radius: 4px;
  height: 56px;
  position: relative;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    ${ClearButton} {
      opacity: 1;
    }
  }
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;
const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  margin-left: -8px;
  img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
`;
const Metadata = styled.div``;
const SongName = styled(Label)`
  font-size: 16px;
  line-height: 24px;
`;
const Artist = styled(Label)`
  color: #b3b3b3;
  font-size: 14px;
  line-height: 16px;
`;
const SongLength = styled(Artist)``;

export default Song;
