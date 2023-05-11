import { useActor } from '@xstate/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import styled from 'styled-components/macro';
import { Maximizable } from '../Window';
import LoginScreen from './LoginScreen';
import Main from './Main';
import Player from './Player';
import SideBar from './SideBar';
import { SpotifyProvider, useSpotifyContext } from './SpotifyContext';

const client = new QueryClient();

interface Props extends Maximizable {}
const SpotifyWrapper = ({ handleMaximize }: Props) => {
  return (
    <QueryClientProvider client={client}>
      <SpotifyProvider>
        <Spotify handleMaximize={handleMaximize} />
      </SpotifyProvider>
    </QueryClientProvider>
  );
};
interface Props extends Maximizable {}
const Spotify = ({ handleMaximize }: Props) => {
  const service = useSpotifyContext();
  const [state] = useActor(service);

  return (
    <Wrapper>
      {state.matches('loggedOut') && <LoginScreen />}
      {state.matches('loggedIn') && (
        <SpotifyLayout>
          <DraggableBar className="action-bar" onDoubleClick={handleMaximize} />
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
