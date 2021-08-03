import { useSelector } from '@xstate/react';
import { FC } from 'react';
import styled from 'styled-components/macro';

import useTransitionHeader from './hooks/useTransitionHeader';
import PlayButton from './PlayButton';
import PlaylistTable from './PlaylistTable';
import { SelectorState } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import UtilityBar from './UtilityBar';

const selectLikedSongs = (state: SelectorState) => state.context.likedSongs;

const LikedSongs: FC = () => {
  const service = useSpotifyContext();
  const likedSongs = useSelector(service, selectLikedSongs);

  const intersectRef = useTransitionHeader({
    backgroundColor: 'rgb(30 21 62)',
    text: 'Liked Songs',
  });
  return (
    <Wrapper>
      <Hero>
        <Skrim />
        <ArtWrapper>
          <Art src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png" />
        </ArtWrapper>
        <PlaylistInfo>
          <Category>Playlist</Category>
          <Title ref={intersectRef}>Liked Songs</Title>
          <Metadata>
            <Author>Chris Bautista</Author>
            <Songs>
              {new Intl.NumberFormat().format(likedSongs?.total ?? 0)}{' '}
              {(likedSongs?.total ?? 0) !== 1 ? 'Songs' : 'Song'}
            </Songs>
          </Metadata>
        </PlaylistInfo>
      </Hero>
      <UtilityBar>
        <UtilityButtonWrapper>
          <PlayButton
            onClick={() => {}}
            isPlaying={false}
            size="large"
            type="default"
          />
        </UtilityButtonWrapper>
      </UtilityBar>
      {likedSongs?.items && <PlaylistTable items={likedSongs?.items} />}
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Hero = styled.div<{ background?: string }>`
  position: relative;
  display: flex;
  padding: 0 32px 24px;
  background: rgb(80, 56, 160);
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

const Metadata = styled.div`
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  > div {
    margin-right: 4px;
  }
`;
const Author = styled.div``;
const Songs = styled.div`
  opacity: 0.7;
  letter-spacing: -0.6px;
`;
const UtilityButtonWrapper = styled.div`
  margin-right: 24px;
`;

export default LikedSongs;