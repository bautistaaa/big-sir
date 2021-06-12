import { FC, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import styled from 'styled-components/macro';
import { AiFillHeart } from 'react-icons/ai';
import { GoPlus } from 'react-icons/go';
import useLocalStorage from '../../hooks/useLocalStorage';
import Home from './icons/Home';
import Search from './icons/Search';
import Library from './icons/Library';
import createSpotifyMachine from './spotify.machine';
import LoginScreen from './LoginScreen';
import HomeView from './Home';

type SpotifyView = 'home' | 'library' | 'search';
const MENU_OPTIONS: {
  text: SpotifyView;
  icon: JSX.Element;
  type: 'HOME' | 'SEARCH' | 'LIBRARY';
}[] = [
  { text: 'home', icon: <Home />, type: 'HOME' },
  { text: 'search', icon: <Search />, type: 'SEARCH' },
  { text: 'library', icon: <Library />, type: 'LIBRARY' },
];
const Spotify: FC = (): JSX.Element => {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [token] = useLocalStorage('token', '');
  const [current, send] = useMachine(createSpotifyMachine(token), {
    devTools: true,
  });
  const [view, setView] = useState<SpotifyView>('home');

  return (
    <Wrapper>
      <TopBar className="action-bar"></TopBar>
      {!token && <LoginScreen />}
      {token && (
        <SpotifyLayout>
          <DraggableBar className="action-bar" />
          <NavBar>
            <Menu>
              <MenuList>
                {MENU_OPTIONS.map(({ icon, text, type }) => {
                  return (
                    <MenuListItem
                      key={text}
                      onClick={() => send({ type })}
                      active={view === text}
                    >
                      {icon} <MenuListItemText>{text}</MenuListItemText>
                    </MenuListItem>
                  );
                })}
              </MenuList>
            </Menu>
            <SecondaryMenu>
              <MenuList>
                <MenuListItem>
                  <PlusContainer>
                    <GoPlus fill="black" />
                  </PlusContainer>
                  Create Playlist
                </MenuListItem>
                <MenuListItem>
                  <HeartContainer>
                    <AiFillHeart fill="white" size={12} />
                  </HeartContainer>
                  Liked Songs
                </MenuListItem>
              </MenuList>
            </SecondaryMenu>
            <Separator />
            <PlaylistMenu>
              <PlaylistScroller>
                <MenuList>
                  {current?.context?.playlists?.items.map((item) => {
                    return (
                      <PlaylistListItem key={item.name}>
                        {item.name}
                      </PlaylistListItem>
                    );
                  })}
                </MenuList>
              </PlaylistScroller>
            </PlaylistMenu>
          </NavBar>
          <Main ref={mainRef}>
            {current.matches('loggedIn.success.success.home') && (
              <HomeView
                feedData={current?.context?.feedData}
                parentRef={mainRef}
              />
            )}
            {current.matches('loggedIn.success.success.search') && (
              <div>search</div>
            )}
            {current.matches('loggedIn.success.success.library') && (
              <div>library</div>
            )}
          </Main>
          <NowPlayingBar />
        </SpotifyLayout>
      )}
      <Content></Content>
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
const Separator = styled.hr`
  width: 100%;
  border: none;
  height: 1px;
  background-color: #3f3f3f;
`;
const Content = styled.div``;
const Wrapper = styled.div`
  font-family: spotify-circular, spotify-circular-cyrillic,
    spotify-circular-arabic, spotify-circular-hebrew, Helvetica Neue, helvetica,
    arial, Hiragino Kaku Gothic Pro, Meiryo, MS Gothic, sans-serif;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const TopBar = styled.div`
  height: 40px;
  background: ${({ theme }) => theme.topBarBackground};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
const NavBar = styled.div`
  display: flex;
  flex-direction: column;
  border-top-left-radius: 10px;
  grid-area: nav-bar;
  background: #000000;
  width: 250px;
  padding: 5px;
`;
const Menu = styled.div`
  margin-top: 50px;
`;
const SecondaryMenu = styled(Menu)`
  margin-top: 17px;
`;
const PlaylistMenu = styled(Menu)`
  position: relative;
  margin-top: 0;
  flex: 1;
`;
const PlaylistScroller = styled.div`
  overflow: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;
const MenuList = styled.ul``;
const MenuListItem = styled.li<{ active?: boolean }>`
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  line-height: 16px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: rgb(179, 179, 179);
  opacity: 0.7;
  transition: background-color 50ms ease-in, color 50ms ease-in;
  ${({ active }) => active && `background: rgb(40,40,40); opacity: 1;`}
  > svg {
    margin-right: 15px;
    transition: background-color 50ms ease-in, color 50ms ease-in;
  }
  &:hover {
    color: white;
  }
`;
const PlaylistListItem = styled(MenuListItem)`
  transition: none;
  font-weight: 400;
`;
const MenuListItemText = styled.span`
  text-transform: capitalize;
`;
const Main = styled.div`
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
  height: 115px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const HeartContainer = styled.div`
  background: linear-gradient(135deg, #450af5, #c4efd9);
  border-radius: 1px;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;
const PlusContainer = styled.div`
  border-radius: 1px;
  background: #fff;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

export default Spotify;
