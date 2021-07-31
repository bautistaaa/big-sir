import { FC, useRef } from 'react';
import styled from 'styled-components';
import { useService } from '@xstate/react';

import { useSpotifyContext } from './SpotifyContext';
import { Context, SpotifyEvent } from './spotify.machine';
import HomeView from './Home';
import LikedSongs from './LikedSongs';
import PlaylistDetails from './PlaylistDetails';

const Main: FC = () => {
  const service = useSpotifyContext();
  const [state] = useService<Context, SpotifyEvent>(service);

  const mainRef = useRef<HTMLDivElement | null>(null);

  return (
    <Wrapper ref={mainRef}>
      {state.matches('loggedIn.success.success.home') && (
        <HomeView parentRef={mainRef} />
      )}
      {state.matches('loggedIn.success.success.search') && <div>search</div>}
      {state.matches('loggedIn.success.success.library') && <div>library</div>}
      {state.matches('loggedIn.success.success.liked') && <LikedSongs />}
      {state.matches('loggedIn.success.success.details.detailsView') && (
        <PlaylistDetails />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
  color: white;
  border-top-right-radius: 10px;
  background-color: #131313;
  grid-area: main;
  z-index: 10;
`;

export default Main;
