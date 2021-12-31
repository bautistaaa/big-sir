import styled from 'styled-components/macro';

import PlaylistHero from '../PlaylistHero';
import UtilityBar from '../PlaylistUtilityBar';
import PlaylistTable from '../PlaylistTable';

interface AlbumDetailsProps {}

const AlbumDetais = () => {
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

export default AlbumDetais;
