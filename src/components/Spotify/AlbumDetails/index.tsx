import { useEffect } from 'react';
import { useActor, useMachine, useSelector } from '@xstate/react';
import styled from 'styled-components';

import PlaylistHero from '../PlaylistHero';
import AlbumTable from './AlbumTable';
import { useSpotifyContext } from '../SpotifyContext';
import albumDetailsMachine from './albumDetails.machine';
import { SelectorState } from '../spotify.machine';
import useImageColors from '../../../hooks/useImageColors';

const selectAlbumId = (state: SelectorState) => state.context.currentListId;
const AlbumDetails = () => {
  const service = useSpotifyContext();
  const [, parentSend] = useActor(service);
  const albumId = useSelector(service, selectAlbumId);
  const [
    {
      context: { albumDetails },
    },
    send,
  ] = useMachine(albumDetailsMachine(albumId ?? ''));
  const imageSrc = albumDetails?.images?.[0]?.url ?? '';
  const [stickyBarBackgroundColor, heroBackgroundColor] = useImageColors(
    imageSrc
  );
  const items = albumDetails?.tracks?.items;

  useEffect(() => {
    if (albumDetails) {
      parentSend({
        type: 'ALBUM_UPDATE',
        payload: {
          album: albumDetails,
          isPlaying: false,
        },
      });
    }
  }, [albumDetails, parentSend]);

  useEffect(() => {
    if (albumId) {
      send({ type: 'REFRESH', payload: { albumId } });
    }
  }, [albumId, send]);

  useEffect(() => {
    parentSend({
      type: 'TRANSITION_HEADER',
      payload: {
        backgroundColor: stickyBarBackgroundColor,
        text: albumDetails?.name ?? '',
      },
    });
  }, [parentSend, stickyBarBackgroundColor, albumDetails?.name]);

  if (!albumDetails) {
    return null;
  }

  return (
    <Wrapper>
      <PlaylistHero
        backgroundColor={heroBackgroundColor}
        image={imageSrc}
        category={albumDetails?.type}
        title={albumDetails?.name}
        author={albumDetails?.artists?.[0]?.name ?? ''}
        tracksTotal={albumDetails?.tracks?.total}
      />
      {/*<UtilityBar playlist={albumDetails} /> */}
      {items && <AlbumTable items={items} />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: -60px;
`;

export default AlbumDetails;
