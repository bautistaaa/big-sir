import { useMachine, useSelector, useService } from '@xstate/react';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { Context, SelectorState, SpotifyEvent } from '../spotify.machine';
import { useSpotifyContext } from '../SpotifyContext';
import playlistDetailsMachine from './playlistDetails.machine';
// import { PlaylistTableV2 } from '../PlaylistTableV2';
import PlaylistTable from '../PlaylistTable';
import UtilityBar from '../PlaylistUtilityBar';
import useImageColors from '../../../hooks/useImageColors';
import useLoadMore from '../../../hooks/useLoadMore';
import PlaylistHero from '../PlaylistHero';

const selectPlaylistId = (state: SelectorState) =>
  state.context.currentListId;

const options = {
  root: document.getElementById('main'),
  rootMargin: '300px 0px 0px 0px',
};
const PlaylistDetails: FC = () => {
  const service = useSpotifyContext();
  const [, parentSend] = useService<Context, SpotifyEvent>(service);
  const playlistId = useSelector(service, selectPlaylistId);
  const [state, send] = useMachine(playlistDetailsMachine(playlistId ?? ''));
  const [inView, setInView] = useState(false);
  const playlist = state.context.playlistDetails;
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

  useLoadMore({
    dep: playlist,
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
      <PlaylistHero
        backgroundColor={heroBackgroundColor}
        image={imageSrc}
        category={playlist?.type}
        title={playlist?.name}
        description={playlist?.description ?? ''}
        author={playlist?.owner?.display_name ?? ''}
        followers={playlist?.followers?.total}
        tracksTotal={playlist?.tracks?.total}
      />
      <UtilityBar playlist={playlist} />
      {items && <PlaylistTable items={items} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: -60px;
`;

export default PlaylistDetails;
