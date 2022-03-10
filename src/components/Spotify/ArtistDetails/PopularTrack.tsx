import styled from 'styled-components';
import { useActor, useSelector } from '@xstate/react';
import { BiPlay } from 'react-icons/bi';
import { IoIosPause } from 'react-icons/io';

import BaseClearButton from '../../../components/ClearButton';
import { useSpotifyContext } from '../SpotifyContext';
import { SelectorState } from '../spotify.machine';
import { oneLine } from '../../../shared/mixins';
import { convertMsToMinutesAndSeconds } from '../../../utils';
import { getToken } from '../utils';

interface PopularTrackProps {
  index: number;
  isActive: boolean;
  onClick(v: string): void;
  track: SpotifyApi.TrackObjectFull;
  uris: string[];
}
const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
const token = getToken();
const PopularTrack = ({
  index,
  isActive,
  onClick,
  track,
  uris,
}: PopularTrackProps) => {
  const service = useSpotifyContext();
  const [state] = useActor(service);
  const currentTrack = useSelector(service, selectCurrentTrack);
  const deviceId = useSelector(service, selectDeviceId);
  const isCurrentTrack = track?.id === currentTrack?.trackId;
  const isPlaying = isCurrentTrack && !!currentTrack?.isPlaying;

  const handleTrackStatus = (
    track: SpotifyApi.TrackObjectSimplified,
    play: boolean,
    reset: boolean
  ) => {
    const playOrPause = async () => {
      const method = play ? 'play' : 'pause';
      const body = {
        uris,
        offset: { uri: track?.uri },
        position_ms: reset ? 0 : currentTrack?.position,
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
    <Wrapper
      isActive={isActive}
      onDoubleClick={() => handleTrackStatus(track, true, true)}
    >
      <IndexColumn>
        <ClearButton
          onClick={(e) => {
            e.stopPropagation();
            handleTrackStatus(track, !isPlaying, false);
          }}
        >
          {isPlaying ? (
            <IoIosPause fill={'white'} size={20} />
          ) : (
            <BiPlay fill={'white'} size={25} />
          )}
        </ClearButton>
        <Index isPlaying={isCurrentTrack}>
          {isPlaying ? (
            <img
              width="14"
              height="14"
              alt=""
              src="https://open.scdn.co/cdn/images/equaliser-animated-green.73b73928.gif"
            />
          ) : (
            <>{index + 1}</>
          )}
        </Index>
      </IndexColumn>
      <TitleColumn>
        <img loading="lazy" src={track?.album.images?.[2]?.url} alt="" />
        <div>
          <Title isPlaying={isCurrentTrack}>{track?.name}</Title>
        </div>
      </TitleColumn>
      <BaseColumn>{convertMsToMinutesAndSeconds(track.duration_ms)}</BaseColumn>
    </Wrapper>
  );
};

const ClearButton = styled(BaseClearButton)`
  display: none;
  height: 16px;
  width: 16px;
  position: relative;
  left: 3px;
`;
const Index = styled.span<{ isPlaying: boolean }>`
  transition: none;
  pointer-events: none;
  ${({ isPlaying }) =>
    isPlaying &&
    `
      color: #1db954;
    `}
`;
const Wrapper = styled.div<{ isActive: boolean }>`
  grid-gap: 16px;
  display: grid;
  padding: 8px 16px;
  grid-template-columns: [index] 16px [first] 6fr [last] minmax(120px, 1fr);
  color: #b3b3b3;
  font-size: 14px;
  border-radius: 4px;
  transition: none;
  height: 56px;
  position: relative;
  letter-spacing: 0.4px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    a {
      color: white;
    }
    ${ClearButton} {
      display: block;
    }
    ${Index} {
      opacity: 0;
    }
  }
  ${({ isActive }) =>
    isActive &&
    `
    background-color: rgba(255,255,255,0.3);
    color: white;
    a { color: white !important; }
    &:hover {
      background-color: rgba(255,255,255,0.3);
    }
  `}
`;
const IndexColumn = styled.div`
  position: relative;
  display: flex;
  justify-self: end;
  align-items: center;
  font-size: 16px;
`;

const BaseColumn = styled.div`
  display: flex;
  align-items: center;
`;
const TitleColumn = styled(BaseColumn)`
  font-size: 16px;
  align-items: center;
  justify-self: start;
  color: white;
  font-weight: 400;
  line-height: 20px;
  text-transform: none;
  a {
    font-size: 14px;
    color: #b3b3b3;
  }
  img {
    margin-right: 16px;
    width: 40px;
    height: 40px;
  }
`;
const Title = styled.div<{ isPlaying: boolean }>`
  transition: none;
  ${oneLine}

  ${({ isPlaying }) =>
    isPlaying &&
    `
      color: #1db954;
    `}
`;
const AlbumName = styled(BaseColumn)``;

export default PopularTrack;
