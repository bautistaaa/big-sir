import { useMachine, useSelector, useService } from '@xstate/react';
import { FC, useEffect, useState } from 'react';
import { IoMdHeart } from 'react-icons/io';
import styled from 'styled-components/macro';

import { Context, SelectorState, SpotifyEvent } from '../spotify.machine';
import { useSpotifyContext } from '../SpotifyContext';
import playlistDetailsMachine from './playlistDetails.machine';
import PlayButton from '../PlayButton';
// import { PlaylistTableV2 } from '../PlaylistTableV2';
import { getToken } from '../utils';
import PlaylistTable from '../PlaylistTable';
import UtilityBar from '../UtilityBar';
import useImageColors from '../../../hooks/useImageColors';
import useLoadMore from '../../../hooks/useLoadMore';

const selectPlaylistId = (state: SelectorState) =>
  state.context.currentPlaylistId;
const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;

const options = {
  root: document.getElementById('main'),
  rootMargin: '300px 0px 0px 0px',
};
const PlaylistDetails: FC = () => {
  const token = getToken();
  const service = useSpotifyContext();
  const [, parentSend] = useService<Context, SpotifyEvent>(service);
  const playlistId = useSelector(service, selectPlaylistId);
  const deviceId = useSelector(service, selectDeviceId);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const [state, send] = useMachine(playlistDetailsMachine(playlistId ?? ''));
  const [inView, setInView] = useState(false);
  const playlist = state.context.playlistDetails;
  const uris = playlist?.tracks?.items.map((item) => item?.track?.uri);
  const isPlaylistPlaying =
    currentTrackInfo?.playlistId === playlist?.id &&
    !!currentTrackInfo?.isPlaying;
  const imageSrc = playlist?.images?.[0]?.url ?? '';
  const [stickyBarBackgroundColor, heroBackgroundColor] = useImageColors(
    imageSrc
  );
  const callback = (inView: boolean) => {
    setInView(inView);
  };
  const shouldDestroy =
    playlist?.tracks?.total === playlist?.tracks?.items?.length;

  const items = playlist?.tracks?.items;

  const handleUtilityPlayButtonClick = () => {
    const playOrPause = async () => {
      const method = currentTrackInfo?.isPlaying ? 'pause' : 'play';
      let body;
      if (playlist) {
        body = {
          context_uri: playlist.uri,
          offset: { uri: currentTrackInfo?.track?.uri },
          position_ms: currentTrackInfo?.position,
        };
      } else {
        body = {
          uris,
          offset: { uri: currentTrackInfo?.track?.uri },
          position_ms: currentTrackInfo?.position,
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

  useLoadMore({
    deps: [playlist],
    callback,
    options,
    shouldDestroy,
  });
  useEffect(() => {
    if (playlist) {
      parentSend({
        type: 'PLAYLIST_UPDATE',
        payload: {
          playlist,
          isPlaying: false,
        },
      });
    }
  }, [playlist, parentSend]);
  useEffect(() => {
    if (inView) {
      send({
        type: 'SCROLL_TO_BOTTOM',
      });
    }
  }, [inView, send]);

  useEffect(() => {
    if (playlistId) {
      send({ type: 'REFRESH', payload: { playlistId } });
    }
  }, [playlistId, send]);

  useEffect(() => {
    parentSend({
      type: 'TRANSITION_HEADER',
      payload: {
        backgroundColor: stickyBarBackgroundColor,
        text: playlist?.name ?? '',
      },
    });
  }, [parentSend, stickyBarBackgroundColor, playlist?.name]);

  if (!playlist) {
    return null;
  }

  return (
    <Wrapper>
      <Hero background={heroBackgroundColor}>
        <Skrim />
        <ArtWrapper>
          <Art src={imageSrc}></Art>
        </ArtWrapper>
        <PlaylistInfo>
          <Category>{playlist?.type}</Category>
          <Title id="title">{playlist?.name}</Title>
          <Description>{playlist?.description}</Description>
          <Metadata>
            <Author>{playlist?.owner?.display_name}</Author>
            {playlist && playlist.followers.total > 0 && (
              <Likes>
                {new Intl.NumberFormat().format(playlist.followers.total)} Likes
              </Likes>
            )}
            <Songs>
              {new Intl.NumberFormat().format(playlist?.tracks?.total ?? 0)}{' '}
              {(playlist?.tracks?.total ?? 0) > 1 ? 'Songs' : 'Song'}
            </Songs>
          </Metadata>
        </PlaylistInfo>
      </Hero>
      <UtilityBar>
        <UtilityButtonWrapper>
          <PlayButton
            onClick={handleUtilityPlayButtonClick}
            isPlaying={isPlaylistPlaying}
            size="large"
            type="default"
          />
        </UtilityButtonWrapper>
        <UtilityButtonWrapper>
          <IoMdHeart fill="#1db954" size={32} />
        </UtilityButtonWrapper>
      </UtilityBar>

      {items && <PlaylistTable items={items} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: -60px;
`;
const Hero = styled.div<{ background?: string }>`
  position: relative;
  display: flex;
  padding: 0 32px 24px;
  background: ${({ background }) => background ?? 'transparent'};
  height: 30vh;
  max-height: 500px;
  min-height: 340px;
`;
const Skrim = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
`;

const ArtWrapper = styled.div`
  z-index: 100;
  align-self: flex-end;
  width: 232px;
  margin-right: 24px;
`;
const Art = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
`;
const PlaylistInfo = styled.div`
  z-index: 100;
  display: flex;
  flex: 1;
  flex-flow: column;
  justify-content: flex-end;
`;
const Category = styled.div`
  font-size: 14px;
  text-transform: uppercase;
`;
const Title = styled.div`
  font-size: 50px;
  font-weight: 600;
  line-height: 68px;
  padding: 5px 0;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-align: left;
  width: 100%;
  word-break: break-word;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 20px;
  text-transform: none;
  opacity: 0.7;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  display: inline-block;
  max-height: 74px;
  overflow: hidden;
  word-break: break-word;
`;
const Metadata = styled.div`
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  > div {
    margin-right: 4px;
  }
`;
const Author = styled.div``;
const Likes = styled.div`
  opacity: 0.7;
  letter-spacing: -0.6px;
`;
const Songs = styled.div`
  opacity: 0.7;
  letter-spacing: -0.6px;
`;
const UtilityButtonWrapper = styled.div`
  margin-right: 24px;
`;

export default PlaylistDetails;
