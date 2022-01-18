import styled from 'styled-components/macro';

import { Category } from './Category';
import Song from './Song';

interface SongsProps {
  songs: SpotifyApi.TrackObjectFull[];
}
const Songs = ({ songs }: SongsProps) => {
  return (
    <Wrapper>
      <Category>Songs</Category>
      <List>
        {songs.slice(0, 4).map((song) => {
          return <Song key={song.id} song={song} />;
        })}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  grid-column: 3/-1;
`;
const List = styled.div``;

export default Songs;
