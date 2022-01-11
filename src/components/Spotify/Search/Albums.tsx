import styled from 'styled-components/macro';

import { Category } from './Category';
import FeedCard from '../FeedCard';
import { useSpotifyContext } from '../SpotifyContext';
import { useActor } from '@xstate/react';

interface AlbumsProps {
  albums: SpotifyApi.AlbumObjectSimplified[];
}
const Albums = ({ albums }: AlbumsProps) => {
  const service = useSpotifyContext();
  const [, send] = useActor(service);

  return (
    <Wrapper>
      <Category>Albums</Category>
      <Items>
        {albums.slice(0, 4).map((album) => {
          return (
            <FeedCard
              key={album.id}
              imageSrc={album?.images?.[0]?.url}
              name={album?.name}
              onClick={() => {
                send({
                  type: 'ALBUM',
                  payload: {
                    albumId: album.id,
                    view: 'album',
                  },
                });
              }}
              onPlayButtonClick={() => {}}
            />
          );
        })}
      </Items>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-column: 1/-1;
`;

const Items = styled.div`
  grid-template-rows: 1fr;
  overflow-y: hidden;
  grid-column: 1/-1;
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;

export default Albums;
