import styled from 'styled-components';

import { Category } from './Category';
import AlbumFeedCard from '../AlbumFeedCard';

interface AlbumsProps {
  albums: SpotifyApi.AlbumObjectSimplified[];
}
const Albums = ({ albums }: AlbumsProps) => {
  return (
    <Wrapper>
      <Category>Albums</Category>
      <Items>
        {albums.slice(0, 4).map((album) => {
          return <AlbumFeedCard key={album.id} listId={album.id} />;
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
