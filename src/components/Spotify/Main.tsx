import { useActor } from '@xstate/react';
import { FC, memo, useRef } from 'react';
import styled from 'styled-components';

import Home from './Home';
import AlbumDetails from './AlbumDetails';
import ArtistDetails from './ArtistDetails';
import LikedSongs from './LikedSongs';
import PlaylistDetails from './PlaylistDetails';
import Search from './Search';
import { useSpotifyContext } from './SpotifyContext';
import StickyBar from './StickyBar';
import { StickyBarProvider } from './StickyBarContext';

const MainWrapper = memo(() => {
  return (
    <StickyBarProvider>
      <Main />
    </StickyBarProvider>
  );
});
const Main: FC = memo(() => {
  const service = useSpotifyContext();
  const [state] = useActor(service);

  const mainRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <StickyBar />
      <Wrapper id="main" ref={mainRef}>
        <Spacer />
        {state.matches('loggedIn.success.home') && (
          <Home parentRef={mainRef} />
        )}
        {state.matches('loggedIn.success.album') && <AlbumDetails />}
        {state.matches('loggedIn.success.artist') && <ArtistDetails />}
        {state.matches('loggedIn.success.search') && <Search />}
        {state.matches('loggedIn.success.liked') && <LikedSongs />}
        {state.matches('loggedIn.success.playlist') && <PlaylistDetails />}
      </Wrapper>
    </>
  );
});
const Spacer = styled.div`
  height: 60px;
  position: sticky;
  top: 0;
`;
const Wrapper = styled.div`
  position: relative;
  overflow: auto;
  color: white;
  border-top-right-radius: 10px;
  background-color: #131313;
  grid-area: main;
  z-index: 10;
`;

export default MainWrapper;
