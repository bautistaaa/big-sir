import { FC, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { AiFillHeart } from 'react-icons/ai';
import { GoPlus } from 'react-icons/go';
import ClearButton from '../../components/ClearButton';
import { login, request } from './utils';
import config from '../../shared/config';
import useLocalStorage from '../../hooks/useLocalStorage';
import Home from './icons/Home';
import Search from './icons/Search';
import Library from './icons/Library';

type SpotifyView = 'home' | 'library';
const MENU_OPTIONS = [
  { text: 'home', icon: <Home /> },
  { text: 'search', icon: <Search /> },
  { text: 'library', icon: <Library /> },
];
const Spotify: FC = (): JSX.Element => {
  const [
    playlists,
    setPlaylists,
  ] = useState<SpotifyApi.ListOfUsersPlaylistsResponse>();
  const [view, setView] = useState('home');
  const [token] = useLocalStorage('token', '');

  const handleLoginClick = () => {
    login();
  };
  useEffect(() => {
    const getUserProfile = async () => {
      const { id } = await request(`${config.apiUrl}/me`);

      const playlists: SpotifyApi.ListOfUsersPlaylistsResponse = await request(
        `${config.apiUrl}/users/${id}/playlists?offset=0&limit=20`
      );
      setPlaylists(playlists);
    };

    getUserProfile();
  }, []);

  return (
    <Wrapper>
      <TopBar className="action-bar"></TopBar>
      {!token && <ClearButton onClick={handleLoginClick}>Login</ClearButton>}
      {token && (
        <SpotifyLayout>
          <DraggableBar className="action-bar" />
          <NavBar>
            <Menu>
              <MenuList>
                {MENU_OPTIONS.map((mo) => {
                  return (
                    <MenuListItem
                      key={mo.text}
                      onClick={() => setView(mo.text)}
                      active={view === mo.text}
                    >
                      {mo.icon} <MenuListItemText>{mo.text}</MenuListItemText>
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
              <MenuList>
                {playlists?.items.map((item) => {
                  return <MenuListItem>{item.name}</MenuListItem>;
                })}
              </MenuList>
            </PlaylistMenu>
          </NavBar>
          <Main />
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
  display: flex;
  margin-top: 55px;
`;
const SecondaryMenu = styled(Menu)`
  margin-top: 17px;
`;
const PlaylistMenu = styled(Menu)`
  margin-top: 0;
  overflow-y: scroll;
`;
const MenuList = styled.ul``;
const MenuListItem = styled.li<{ active?: boolean }>`
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  color: white;
  opacity: 0.7;
  ${({ active }) => active && `background: rgb(40,40,40); opacity: 1;`}
  > svg {
    margin-right: 15px;
  }
`;
const MenuListItemText = styled.span`
  text-transform: capitalize;
`;
const Main = styled.div`
  border-top-right-radius: 10px;
  background-color: rgb(32, 32, 32);
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
