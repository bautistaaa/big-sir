import { useService } from '@xstate/react';
import { FC, memo, useRef } from 'react';
import styled from 'styled-components';

import HomeView from './Home';
import LikedSongs from './LikedSongs';
import PlaylistDetails from './PlaylistDetails';
import Search from './Search';
import { Context, SpotifyEvent } from './spotify.machine';
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
  const [state] = useService<Context, SpotifyEvent>(service);

  const mainRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <StickyBar />
      <Wrapper id="main" ref={mainRef}>
        <Spacer />
        {state.matches('loggedIn.success.home') && (
          <HomeView parentRef={mainRef} />
        )}
        {state.matches('loggedIn.success.search') && <Search />}
        {state.matches('loggedIn.success.library') && <div>library</div>}
        {state.matches('loggedIn.success.liked') && <LikedSongs />}
        {state.matches('loggedIn.success.details') && <PlaylistDetails />}
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
