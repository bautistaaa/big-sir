import { FC, memo } from 'react';
import styled from 'styled-components';
import { AiFillHeart } from 'react-icons/ai';
import { GoPlus } from 'react-icons/go';
import { useSelector, useService } from '@xstate/react';

import Home from '../icons/Home';
import Search from '../icons/Search';
import Library from '../icons/Library';
import { useSpotifyContext } from '../SpotifyContext';
import { Context, SelectorState } from '../spotify.machine';

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

const selectPlaylists = (state: SelectorState) => state.context.playlists;

const SideBar: FC = memo(() => {
  const service = useSpotifyContext();
  const [, send] = useService<Context, any>(service);
  const playlists = useSelector(service, selectPlaylists);


  return (
    <NavBar>
      <Menu>
        <MenuList>
          {MENU_OPTIONS.map(({ icon, text, type }) => {
            return (
              <MenuListItem key={text} onClick={() => send({ type })} active>
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
            {playlists?.items?.map((item) => {
              return (
                <PlaylistListItem
                  key={item.id}
                  onClick={() => {
                    send({
                      type: 'DETAILS',
                      payload: { playlistId: item.id },
                    });
                  }}
                >
                  {item?.name}
                </PlaylistListItem>
              );
            })}
          </MenuList>
        </PlaylistScroller>
      </PlaylistMenu>
    </NavBar>
  );
});

const NavBar = styled.div`
  display: flex;
  flex-direction: column;
  border-top-left-radius: 10px;
  grid-area: nav-bar;
  background: #000000;
  width: 250px;
  padding: 5px;
`;
const Separator = styled.hr`
  width: 100%;
  border: none;
  height: 1px;
  background-color: #3f3f3f;
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

export default SideBar;
