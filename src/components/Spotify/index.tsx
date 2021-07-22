import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { useSelector } from '@xstate/react';

import SideBar from './SideBar';
import Main from './Main';
import LoginScreen from './LoginScreen';
import Player from './Player';
import { SpotifyProvider, useSpotifyContext } from './SpotifyContext';
import { SelectorState } from './spotify.machine';
import StickyDetailsBar from './StickyDetailsBar';
import useLocalStorage from '../../hooks/useLocalStorage';

const SpotifyWrapper = memo(() => {
  console.count('wrapper');
  return (
    <SpotifyProvider>
      <Spotify />
    </SpotifyProvider>
  );
});
const selectHeaderState = (state: SelectorState) => state.context.headerState;
const Spotify: FC = () => {
  const [token] = useLocalStorage('token', '');
  const service = useSpotifyContext();
  const headerState = useSelector(service, selectHeaderState);
  console.count('layout');

  return (
    <Wrapper>
      {!token && <LoginScreen />}
      {token && (
        <SpotifyLayout>
          <StickyDetailsBar
            backgroundColor={headerState?.backgroundColor ?? '#000'}
            opacity={headerState?.opacity ?? 0}
          >
            <StickyDetailsBarText>
              {headerState?.playlistName ?? ''}
            </StickyDetailsBarText>
          </StickyDetailsBar>
          <DraggableBar className="action-bar" />
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
