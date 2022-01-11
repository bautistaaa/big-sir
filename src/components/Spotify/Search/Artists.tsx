import styled from 'styled-components/macro';

import { Category } from './Category';
import FeedCard from '../FeedCard';

interface ArtistsProps {
  artists: SpotifyApi.ArtistObjectFull[];
}
const Artists = ({ artists }: ArtistsProps) => {
  return (
    <Wrapper>
      <Category>Artists</Category>
      <Items>
        {artists.slice(0, 4).map((artist) => {
          return (
            <FeedCard
              key={artist.id}
              imageSrc={artist?.images?.[0]?.url}
              name={artist?.name}
              onClick={() => {}}
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

export default Artists;
