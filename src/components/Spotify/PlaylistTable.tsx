import { useRef, useState } from 'react';
import { useSelector } from '@xstate/react';
import mergeRefs from 'react-merge-refs';
import { useResizeDetector } from 'react-resize-detector';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components/macro';
import { AiOutlineClockCircle } from 'react-icons/ai';

import { useSpotifyContext } from './SpotifyContext';
import {
  convertMsToMinutesAndSeconds,
  formatDateForSpotify,
} from '../../utils';
import { oneLine } from '../../shared/mixins';
import { getToken } from './utils';
import { SelectorState } from './spotify.machine';

const selectCurrentTrackId = (state: SelectorState) =>
  state.context.currentTrackId;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;

const PlaylistTable = ({
  items,
  playlist: currentPlaylist,
}: {
  items: any;
  playlist?: any;
}) => {
  const token = getToken();
  const service = useSpotifyContext();
  const currentTrackId = useSelector(service, selectCurrentTrackId);
  const deviceId = useSelector(service, selectDeviceId);
  const [active, setActive] = useState<string>();
  // HELP: i couldnt figure out how to do this with sticky + intersection observer
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const wrapperWidth = useRef<number | undefined>();
  const { ref: resizeRef } = useResizeDetector({
    onResize: () => {
      wrapperWidth.current = resizeRef.current.getBoundingClientRect().width;
    },
  });
  const { ref, inView } = useInView({
    initialInView: true,
    threshold: [1],
  });

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
          uris: items?.map((x: any) => x?.track?.uri),
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
        setActive(track.id);
      } catch (e) {
        console.error(e);
      }
    };

    play();
  };

  return (
    <TableWrapper ref={mergeRefs([tableWrapperRef, resizeRef])}>
      <HeaderWrapper>
        <div
          ref={ref}
          style={{
            boxSizing: 'border-box',
            height: '30px',
            border: '1px solid transparent',
            position: 'absolute',
            top: '-60px',
          }}
        />
        <HeaderPositioner isSticky={!inView} width={wrapperWidth.current}>
          <Header isSticky={!inView}>
            <ColumnName>#</ColumnName>
            <ColumnName>Title</ColumnName>
            <ColumnName>Album</ColumnName>
            <ColumnName>Date Added</ColumnName>
            <ColumnName>
              <AiOutlineClockCircle stroke="#ffffff" size={16} />
            </ColumnName>
          </Header>
        </HeaderPositioner>
      </HeaderWrapper>
      <List isSticky={!inView}>
        {items.map((item: any, i: any) => {
          const { track, added_at } = item;
          if (!track) return null;
          const isActive = track.id === active;
          const isPlaying = track.id === currentTrackId;
          // apparently you can add the same track twice
          // track number isnt unique either.. so index will work for now?
          return (
            <ListItem
              key={`${track.id}-${i}`}
              onDoubleClick={() => handleDoubleClick(track)}
              isActive={isActive}
              onClick={() => setActive(track.id)}
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
                  <>{i + 1}</>
                )}
              </BaseColumn>
              <TitleColumn>
                <img
                  loading="lazy"
                  src={track?.album.images?.[2]?.url}
                  alt=""
                />
                <div>
                  <Title isPlaying={isPlaying}>{track?.id}</Title>
                  <ArtistName>
                    <a href="#">{track.album?.artists?.[0]?.name}</a>
                  </ArtistName>
                </div>
              </TitleColumn>
              <AlbumName>
                <a href="#">{track.album?.name}</a>
              </AlbumName>
              {/* @ts-ignore */}
              <BaseColumn>
                {formatDateForSpotify(new Date(added_at))}
              </BaseColumn>
              <BaseColumn>
                {convertMsToMinutesAndSeconds(track.duration_ms)}
              </BaseColumn>
            </ListItem>
          );
        })}
        <IntersectionDetection id="load-more" />
      </List>
    </TableWrapper>
  );
};

const IntersectionDetection = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0;
  bottom: 30px;
`;

const TableWrapper = styled.div`
  position: relative;
  padding: 0 32px;
  a {
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    white-space: unset;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: #b3b3b3;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const List = styled.ol<{ isSticky: boolean }>`
  ${({ isSticky }) =>
    isSticky &&
    `
      padding-top: 54px;
    `}
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
const HeaderWrapper = styled.div`
  position: relative;
  z-index: 99;
  transition: none;
`;
const HeaderPositioner = styled.div<{
  isSticky: boolean;
  width: number | undefined;
}>`
  margin: 0 -32px 16px;
  padding: 0 32px;
  height: 36px;
  z-index: 99;
  transition: none;
  position: relative;
  ${({ isSticky, width }) =>
    isSticky &&
    `
      background: #181818;
      border-bottom: 1px solid rgb(255 255 255 / 10%);
      position: fixed;
      top: 60px;
      width: ${width ?? 0}px;
    `}
`;
const Header = styled.div<{ isSticky: boolean }>`
  grid-gap: 16px;
  display: grid;
  padding: 0 16px;
  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(
      120px,
      1fr
    );
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
  color: #b3b3b3;
  height: 100%;
  transition: none;
  ${({ isSticky }) =>
    isSticky &&
    `
      border-bottom: none;
    `}
`;
const ColumnName = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.1em;
  line-height: 16px;
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
const ArtistName = styled.div`
  ${oneLine}
`;
const AlbumName = styled(BaseColumn)``;

export default PlaylistTable;
