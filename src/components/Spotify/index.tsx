import { FC, memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import useLocalStorage from '../../hooks/useLocalStorage';
import StickyDetailsBar from './StickyDetailsBar';
import HomeView from './Home';
import LoginScreen from './LoginScreen';
import Player from './Player';
import SideBar from './SideBar';
import PlaylistDetails from './PlaylistDetails';
import { SpotifyProvider, useSpotifyContext } from './SpotifyContext';
import { useService } from '@xstate/react';
import { Context } from './spotify.machine';

const SpotifyWrapper = memo(() => {
  return (
    <SpotifyProvider>
      <Spotify />
    </SpotifyProvider>
  );
});

const Spotify: FC = () => {
  const service = useSpotifyContext();
  const [state] = useService<Context, any>(service);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [token] = useLocalStorage('token', '');
  const playlistDetails = state.context.playlistDetails;
  const feedData = state.context.feedData;

  return (
    <Wrapper>
      {!token && <LoginScreen />}
      {token && (
        <SpotifyLayout>
          <StickyDetailsBar
            backgroundColor={
              state?.context?.headerState?.backgroundColor ?? '#000'
            }
            opacity={state?.context?.headerState?.opacity ?? 0}
          >
            <StickyDetailsBarText>
              {state?.context?.headerState?.playlistName ?? ''}
            </StickyDetailsBarText>
          </StickyDetailsBar>
          <DraggableBar className="action-bar" />
          <SideBar />
          <Main ref={mainRef}>
            {state.matches('loggedIn.success.success.home') && (
              <HomeView feedData={feedData} parentRef={mainRef} />
            )}
            {state.matches('loggedIn.success.success.search') && (
              <div>search</div>
            )}
            {state.matches('loggedIn.success.success.library') && (
              <div>library</div>
            )}
            {state.matches('loggedIn.success.success.details.detailsView') && (
              <PlaylistDetails playlist={playlistDetails} />
            )}
          </Main>
          <NowPlayingBar>
            <Player />
          </NowPlayingBar>
        </SpotifyLayout>
      )}
    </Wrapper>
  );
};

const DraggableBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
`;
const Wrapper = styled.div`
  font-family: Helvetica Neue, helvetica, arial, sans-serif;
  height: calc(100% - 2px);
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const SpotifyLayout = styled.div`
  display: grid;
  grid-template-areas:
    'nav-bar main main'
    'now-playing-bar now-playing-bar now-playing-bar';
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  height: 100%;
  min-height: 100%;
  position: relative;
  width: 100%;
  flex: 1;
`;
const Main = styled.div`
  position: relative;
  overflow: auto;
  color: white;
  border-top-right-radius: 10px;
  background-color: #131313;
  grid-area: main;
`;
const NowPlayingBar = styled.div`
  grid-area: now-playing-bar;
  background-color: rgb(24, 24, 24);
  width: 100%;
  height: 90px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const StickyDetailsBarText = styled.div`
  color: #fff;
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  letter-spacing: 0.5px;
`;

export default SpotifyWrapper;
