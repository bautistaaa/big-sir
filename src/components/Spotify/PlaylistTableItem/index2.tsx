import { FC, memo, useState } from 'react';
import { useMachine, useSelector, useService } from '@xstate/react';
import styled from 'styled-components';
import { IoIosPause } from 'react-icons/io';
import { BiPlay } from 'react-icons/bi';

import { Context, SelectorState, SpotifyEvent } from '../spotify.machine';
import {
  convertMsToMinutesAndSeconds,
  formatDateForSpotify,
} from '../../../utils';
import { useSpotifyContext } from './../SpotifyContext';
import { getToken } from './../utils';
import { oneLine } from '../../../shared/mixins';
import ClearButton from '../../../components/ClearButton';
import playlistItemMachine from './playlistTableItem.machine';

interface Props {
  item: any;
  index: number;
  uris: string[];
  onItemClick(v: string): void;
  isActive: boolean;
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
  isActive,
}) => {
  const { track, added_at } = item;
  const token = getToken();

  const service = useSpotifyContext();
  const [state] = useService<Context, SpotifyEvent>(service);
  const isLikedSongsView = state.matches('loggedIn.success.liked');
  const currentTrack = useSelector(service, selectCurrentTrack);
  const currentPlaylist = useSelector(service, selectCurrentPlayist);
  const deviceId = useSelector(service, selectDeviceId);
  const isCurrentTrack = track?.id === currentTrack?.trackId;
  const isTrackPlaying = isCurrentTrack && !!currentTrack?.isPlaying;
  const [
    {
      context: { isSelected, isHovered, isPlaying },
    },
    send,
  ] = useMachine(playlistItemMachine(isTrackPlaying));

  const shouldDisplayPlayButton = !isTrackPlaying && (isHovered || isSelected);
  const shouldDisplayPauseButton = isTrackPlaying && (isHovered || isSelected);

  const handleTrackStatus = (
    track: SpotifyApi.TrackObjectFull,
    play: boolean,
    reset: boolean
  ) => {
    const playOrPause = async () => {
      const method = play ? 'play' : 'pause';
      /**
       * liked songs playlist uses `uri` vs `context_uri`
       * */
      let body;
      if (isLikedSongsView) {
        body = {
          uris,
          offset: { uri: track?.uri },
          position_ms: reset ? 0 : currentTrack?.position,
        };
      } else {
        body = {
          context_uri: currentPlaylist?.playlist.uri,
          offset: { uri: track?.uri },
          position_ms: reset ? 0 : currentTrack?.position,
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

        send({ type: 'TOGGLE' });
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
      onDoubleClick={() => handleTrackStatus(track, true, true)}
      isActive={isActive}
      onClick={() => onItemClick(track.id)}
    >
      <FirstColumn>
        <GnarlyColumn
          isDisplayingPlayButton={shouldDisplayPlayButton}
          isDisplayingPauseButton={shouldDisplayPauseButton}
        >
          {isPlaying && (
            <ClearButton
              onClick={(e) => {
                e.stopPropagation();
                handleTrackStatus(track, true, false);
              }}
            >
              <BiPlay fill={'white'} size={25} />
            </ClearButton>
          )}

          {!isPlaying && (
            <ClearButton
              onClick={(e) => {
                e.stopPropagation();
                handleTrackStatus(track, false, false);
              }}
            >
              <IoIosPause fill={'white'} size={20} />
            </ClearButton>
          )}

          {!isSelected && !isHovered && (
            <img
              width="14"
              height="14"
              alt=""
              src="https://open.scdn.co/cdn/images/equaliser-animated-green.73b73928.gif"
            />
          )}

          {!isHovered && !isSelected && !isPlaying && (
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

// export default PlaylistTableItem;
export default memo(PlaylistTableItem);
