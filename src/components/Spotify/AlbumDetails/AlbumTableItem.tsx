import { memo, useState } from 'react';
import { useSelector } from '@xstate/react';
import styled from 'styled-components';
import { IoIosPause } from 'react-icons/io';
import { BiPlay } from 'react-icons/bi';

import { SelectorState } from '../spotify.machine';
import { convertMsToMinutesAndSeconds } from '../../../utils';
import { useSpotifyContext } from '../SpotifyContext';
import { getToken } from '../utils';
import { oneLine } from '../../../shared/mixins';
import ClearButton from '../../../components/ClearButton';

interface Props {
  item: SpotifyApi.TrackObjectSimplified;
  index: number;
  onItemClick(v: string): void;
  isActive: boolean;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
const selectCurrentAlbum = (state: SelectorState) =>
  state.context.currentAlbumInfo;

const AlbumTableItem = ({ item, index, onItemClick, isActive }: Props) => {
  const token = getToken();

  const service = useSpotifyContext();
  const currentTrack = useSelector(service, selectCurrentTrack);
  const currentAlbum = useSelector(service, selectCurrentAlbum);
  const deviceId = useSelector(service, selectDeviceId);
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentTrack = item.id === currentTrack?.trackId;
  const isCurrentTrackAndPlaying = isCurrentTrack && !!currentTrack?.isPlaying;
  const displayPlayButton =
    (isActive && isCurrentTrack && !isCurrentTrackAndPlaying) ||
    (isActive && !isCurrentTrack && !isCurrentTrackAndPlaying) ||
    (isHovered && isCurrentTrack && !isCurrentTrackAndPlaying) ||
    (isHovered && !isCurrentTrack && !isCurrentTrackAndPlaying);
  const displayPauseButton =
    (isActive && isCurrentTrack && isCurrentTrackAndPlaying) ||
    (isActive && !isCurrentTrack && isCurrentTrackAndPlaying) ||
    (isHovered && isCurrentTrack && isCurrentTrackAndPlaying) ||
    (isHovered && !isCurrentTrack && isCurrentTrackAndPlaying);

  const handleTrackStatus = (
    track: SpotifyApi.TrackObjectSimplified,
    play: boolean,
    reset: boolean
  ) => {
    const playOrPause = async () => {
      const method = play ? 'play' : 'pause';
      const body = {
        context_uri: currentAlbum?.album.uri,
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
        // onPlay(track.id);
      } catch (e) {
        console.error(e);
      }
    };

    playOrPause();
  };

  if (!item) return null;
  // apparently you can add the same track twice
  // track number isnt unique either.. so index will work for now?
  return (
    <ListItem
      key={`${item.id}-${index}`}
      onDoubleClick={() => handleTrackStatus(item, true, true)}
      isActive={isActive}
      onClick={() => onItemClick(item.id)}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <FirstColumn>
        <GnarlyColumn
          isDisplayingPlayButton={displayPlayButton}
          isDisplayingPauseButton={displayPauseButton}
        >
          {displayPlayButton && (
            <ClearButton
              onClick={(e) => {
                e.stopPropagation();
                handleTrackStatus(item, true, false);
              }}
            >
              <BiPlay fill={'white'} size={25} />
            </ClearButton>
          )}

          {displayPauseButton && (
            <ClearButton
              onClick={(e) => {
                e.stopPropagation();
                handleTrackStatus(item, false, false);
              }}
            >
              <IoIosPause fill={'white'} size={20} />
            </ClearButton>
          )}

          {!displayPauseButton &&
            !displayPlayButton &&
            isCurrentTrackAndPlaying && (
              <img
                width="14"
                height="14"
                alt=""
                src="https://open.scdn.co/cdn/images/equaliser-animated-green.73b73928.gif"
              />
            )}

          {!displayPauseButton &&
            !displayPlayButton &&
            !isCurrentTrackAndPlaying && (
              <Index isPlaying={isCurrentTrack}>{index + 1}</Index>
            )}
        </GnarlyColumn>
      </FirstColumn>
      <TitleColumn>
        <div>
          <Title isPlaying={isCurrentTrack}>{item?.name}</Title>
          <ArtistName>
            <a href="#">{item?.artists?.[0]?.name}</a>
          </ArtistName>
        </div>
      </TitleColumn>
      {/* @ts-ignore */}
      <BaseColumn style={{ justifySelf: 'end' }}>
        {convertMsToMinutesAndSeconds(item.duration_ms)}
      </BaseColumn>
    </ListItem>
  );
};

const BaseColumn = styled.div`
  display: flex;
  align-items: center;
`;
const FirstColumn = styled(BaseColumn)`
  justify-content: end;
`;
const ListItem = styled.li<{ isActive: boolean }>`
  grid-gap: 16px;
  display: grid;
  padding: 8px 16px;
  grid-template-columns: [index] 16px [first] 4fr [last] minmax(120px, 1fr);
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
const Index = styled.span<{ isPlaying: boolean }>`
  transition: none;
  ${({ isPlaying }) =>
    isPlaying &&
    `
      color: #1db954;
    `}
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
const ArtistName = styled.div`
  ${oneLine}
`;
const GnarlyColumn = styled.div<{
  isDisplayingPlayButton: boolean;
  isDisplayingPauseButton: boolean;
}>`
  display: flex;
  justify-self: start;
  align-items: center;
  font-size: 16px;
  ${({ isDisplayingPlayButton }) =>
    isDisplayingPlayButton &&
    `
      position: relative;
      left: 9px;
    `}
  ${({ isDisplayingPauseButton }) =>
    isDisplayingPauseButton &&
    `
      position: relative;
      left: 6px;
    `}
`;

// export default PlaylistTableItem;
export default memo(AlbumTableItem);
