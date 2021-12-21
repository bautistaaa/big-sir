import { FC, useState } from 'react';
import { useSelector } from '@xstate/react';
import styled from 'styled-components';

import {
  convertMsToMinutesAndSeconds,
  formatDateForSpotify,
} from '../../utils';
import { useSpotifyContext } from './SpotifyContext';
import { SelectorState } from './spotify.machine';
import { getToken } from './utils';
import { oneLine } from '../../shared/mixins';

interface Props {
  item: any;
  index: number;
  uris: string[];
  onItemClick(v: string): void;
  activeTrack: string;
}

const selectCurrentTrackId = (state: SelectorState) =>
  state.context.currentTrackId;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
const selectCurrentPlayist = (state: SelectorState) =>
  state.context.currentPlaylist;

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
  const currentTrackId = useSelector(service, selectCurrentTrackId);
  const currentPlaylist = useSelector(service, selectCurrentPlayist);
  const deviceId = useSelector(service, selectDeviceId);
  const isActive = track.id === activeTrack;
  const isPlaying = track.id === currentTrackId;

  const handleDoubleClick = (track: SpotifyApi.TrackObjectFull) => {
    const play = async () => {
      let body;
      if (currentPlaylist) {
        body = {
          context_uri: currentPlaylist?.uri,
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
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
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

    play();
  };

  if (!track) return null;
  // apparently you can add the same track twice
  // track number isnt unique either.. so index will work for now?
  return (
    <ListItem
      key={`${track.id}-${index}`}
      onDoubleClick={() => handleDoubleClick(track)}
      isActive={isActive}
      onClick={() => onItemClick(track.id)}
    >
      <BaseColumn>
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
      </BaseColumn>
      <TitleColumn>
        <img loading="lazy" src={track?.album.images?.[2]?.url} alt="" />
        <div>
          <Title isPlaying={isPlaying}>{track?.name}</Title>
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

export default PlaylistTableItem;
