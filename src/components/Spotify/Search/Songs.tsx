import styled from 'styled-components/macro';
import { IoIosPause } from 'react-icons/io';
import { BiPlay } from 'react-icons/bi';

import { oneLine } from '../../../shared/mixins';
import { Category } from './Category';
import BaseClearButton from '../../../components/ClearButton';
import { convertMsToMinutesAndSeconds } from '../../../utils';

interface SongsProps {
  songs: SpotifyApi.TrackObjectFull[];
}
const Songs = ({ songs }: SongsProps) => {
  return (
    <Wrapper>
      <Category>Songs</Category>
      <List>
        {songs.slice(0, 4).map((song) => {
          return (
            <ListItem key={song.id}>
              <Left>
                <ImageWrapper>
                  <img src={song.album?.images?.[2]?.url} alt="album art" />
                  <ClearButton
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <BiPlay fill={'white'} size={25} />
                  </ClearButton>
                </ImageWrapper>
                <Metadata>
                  <SongName>{song.name}</SongName>
                  <Artist>{song.artists?.[0]?.name}</Artist>
                </Metadata>
              </Left>
              <Right>
                <SongLength>
                  {convertMsToMinutesAndSeconds(song.duration_ms)}
                </SongLength>
              </Right>
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  grid-column: 3/-1;
`;
const ClearButton = styled(BaseClearButton)`
  opacity: 0;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const List = styled.div``;
const ListItem = styled.div`
  display: grid;
  grid-gap: 16px;
  padding: 0 16px;
  grid-template-columns: [first] 4fr [last] 1fr;
  border: 1px solid transparent;
  border-radius: 4px;
  height: 56px;
  position: relative;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    ${ClearButton} {
      opacity: 1;
    }
  }
`;
const Left = styled.div`
  display: flex;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`;
const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  margin-left: -8px;
  img {
    height: 40px;
    width: 40px;
    object-fit: cover;
  }
`;
const Label = styled.div`
  font-weight: 400;
  letter-spacing: 0.4px;
  text-transform: none;
  ${oneLine}
`;
const Metadata = styled.div``;
const SongName = styled(Label)`
  font-size: 16px;
  line-height: 24px;
`;
const Artist = styled(Label)`
  color: #b3b3b3;
  font-size: 14px;
  line-height: 16px;
`;
const SongLength = styled(Artist)``;
export default Songs;
