import styled from 'styled-components';

import AlbumFeedCard from '../AlbumFeedCard';

interface ArtistAlbumsProps {
  albums: SpotifyApi.AlbumObjectSimplified[];
}
const ArtistAlbums = ({ albums }: ArtistAlbumsProps) => {
  return (
    <Wrapper>
      <Header>Albums</Header>
      <AlbumList>
        {albums.map((album) => {
          return (
            <Album>
              <AlbumFeedCard listId={album.id} />
            </Album>
          );
        })}
      </AlbumList>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Header = styled.h2`
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 28px;
  margin: 0 0 20px;
`;
const AlbumList = styled.div`
  grid-template-rows: 1fr;
  overflow-y: hidden;
  grid-column: 1/-1;
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;
const Album = styled.div``;

export default ArtistAlbums;
