import { FC, memo } from 'react';
import styled from 'styled-components/macro';

import SideBar from './SideBar';
import Main from './Main';
import LoginScreen from './LoginScreen';
import Player from './Player';
import { SpotifyProvider } from './SpotifyContext';
import StickyDetailsBar from './StickyDetailsBar';
import useLocalStorage from '../../hooks/useLocalStorage';

const SpotifyWrapper = memo(() => {
  return (
    <SpotifyProvider>
      <Spotify />
    </SpotifyProvider>
  );
});
const Spotify: FC = () => {
  const [token] = useLocalStorage('token', '');

  return (
    <Wrapper>
      {!token && <LoginScreen />}
      {token && (
        <SpotifyLayout>
          <DraggableBar className="action-bar" />
          <StickyDetailsBar />
          <SideBar />
          <Main />
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
const NowPlayingBar = styled.div`
  grid-area: now-playing-bar;
  background-color: rgb(24, 24, 24);
  width: 100%;
  height: 90px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;

export default SpotifyWrapper;
