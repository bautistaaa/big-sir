import { FC, useState } from 'react';
import { useSelector } from '@xstate/react';
import styled from 'styled-components';
import { IoIosPause } from 'react-icons/io';
import { BiPlay } from 'react-icons/bi';

import {
  convertMsToMinutesAndSeconds,
  formatDateForSpotify,
} from '../../utils';
import { useSpotifyContext } from './SpotifyContext';
import { SelectorState } from './spotify.machine';
import { getToken } from './utils';
import { oneLine } from '../../shared/mixins';
import ClearButton from '../../components/ClearButton';

interface Props {
  item: any;
  index: number;
  uris: string[];
  onItemClick(v: string): void;
  activeTrack: string;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
const selectCurrentPlayist = (state: SelectorState) =>
  state.context.currentPlaylistInfo;

const PlaylistTableItem: FC<Props> = ({
  item,
  uris,
  index,
  onItemClick,
  activeTrack,
}) => {
  const { track, added_at } = item;
  const token = getToken();

  const service = useSpotifyContext();
  const currentTrack = useSelector(service, selectCurrentTrack);
  const currentPlaylist = useSelector(service, selectCurrentPlayist);
  const deviceId = useSelector(service, selectDeviceId);
  const [isHovered, setIsHovered] = useState(false);
  const isActive = track.id === activeTrack;
  const isCurrentTrack = track.id === currentTrack?.track?.id;
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
  // console.log({
  //   isCurrentTrack,
  //   isCurrentTrackAndPlaying,
  //   isActive,
  // });

  const handleTrackStatus = (
    track: SpotifyApi.TrackObjectFull,
    play: boolean
  ) => {
    const playOrPause = async () => {
      const method = play ? 'play' : 'pause';
      let body;
      if (currentPlaylist?.playlist) {
        body = {
          context_uri: currentPlaylist.playlist.uri,
          offset: { uri: track?.uri },
        };
      } else {
        body = {
          uris,
          offset: { uri: track?.uri },
        };
      }
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

  if (!track) return null;
  // apparently you can add the same track twice
  // track number isnt unique either.. so index will work for now?
  return (
    <ListItem
      key={`${track.id}-${index}`}
      onDoubleClick={() => handleTrackStatus(track, true)}
      isActive={isActive}
      onClick={() => onItemClick(track.id)}
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
                handleTrackStatus(track, true);
              }}
            >
              <BiPlay fill={'white'} size={25} />
            </ClearButton>
          )}

          {displayPauseButton && (
            <ClearButton
              onClick={(e) => {
                e.stopPropagation();
                handleTrackStatus(track, false);
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
        <img loading="lazy" src={track?.album.images?.[2]?.url} alt="" />
        <div>
          <Title isPlaying={isCurrentTrack}>{track?.name}</Title>
          <ArtistName>
            <a href="#">{track.album?.artists?.[0]?.name}</a>
          </ArtistName>
        </div>
      </TitleColumn>
      <AlbumName>
        <a href="#">{track.album?.name}</a>
      </AlbumName>
      {/* @ts-ignore */}
      <BaseColumn>{formatDateForSpotify(new Date(added_at))}</BaseColumn>
      <BaseColumn>{convertMsToMinutesAndSeconds(track.duration_ms)}</BaseColumn>
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
  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(
      120px,
      1fr
    );
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
const AlbumName = styled(BaseColumn)``;
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

export default PlaylistTableItem;
