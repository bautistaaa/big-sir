import { useSelector } from '@xstate/react';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useActor } from '@xstate/react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { Menu } from '@headlessui/react';
import { useInView } from 'react-intersection-observer';

import { SelectorState } from './spotify.machine';
import SearchForm from './SearchForm';
import { useSpotifyContext } from './SpotifyContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const selectHeaderState = (state: SelectorState) => state.context.headerState;
const selectUserProfile = (state: SelectorState) => state.context.userProfile;
const selectView = (state: SelectorState) => state.context.view;
const selectPlaylistId = (state: SelectorState) => state.context.currentListId;

const StickyBar: FC = () => {
  const service = useSpotifyContext();
  const [state, send] = useActor(service);
  const headerState = useSelector(service, selectHeaderState);
  const userProfile = useSelector(service, selectUserProfile);
  const playlistId = useSelector(service, selectPlaylistId);
  const view = useSelector(service, selectView);
  const [opacity, setOpacity] = useState(view === 'search' ? 1 : 0);
  const [, setToken] = useLocalStorage('token', '');

  const { ref, entry } = useInView({
    initialInView: false,
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  });

  useEffect(() => {
    if (view === 'search') {
      setOpacity(1);
    }
    return () => {
      setOpacity(0);
    };
  }, [playlistId, view]);

  useEffect(() => {
    const el = document.getElementById('title');

    if (el) {
      ref(el);
    }
  }, [ref, headerState.text]);

  useEffect(() => {
    if (view === 'search') {
      return;
    }
    const el = document.getElementById('title');

    if (el) {
      const diff = 1 - (entry?.intersectionRatio ?? 1);
      setOpacity(diff > 0.9 ? 1 : diff);
    }
  }, [entry?.isIntersecting, entry?.intersectionRatio, ref, view]);

  const handleLogoutClick = () => {
    send({ type: 'LOG_OUT' });
    setToken('');
  };

  return (
    <Wrapper className="action-bar">
      <Background background={headerState.backgroundColor} opacity={opacity} />
      <ContentWrapper>
        <DynamicContent>
          {state.matches('loggedIn.success.search') && <SearchForm />}
          {(state.matches('loggedIn.success.playlist') ||
            state.matches('loggedIn.success.liked') ||
            state.matches('loggedIn.success.album')) && (
            <Text opacity={opacity}>{headerState.text}</Text>
          )}
        </DynamicContent>
        <Menu as={StyledMenu}>
          <Menu.Button as={StyledMenuButton}>
            {({ open }) => (
              <AccountButton open={open}>
                <AccountImage>
                  <img src={userProfile?.images?.[0]?.url} alt="" />
                </AccountImage>
                <AccountName>{userProfile?.display_name}</AccountName>
                {open ? (
                  <AiFillCaretUp
                    style={{ marginLeft: '8px', marginRight: '6px' }}
                  />
                ) : (
                  <AiFillCaretDown
                    style={{ marginLeft: '8px', marginRight: '6px' }}
                  />
                )}
              </AccountButton>
            )}
          </Menu.Button>
          <Menu.Items as={StyledMenuItems}>
            <Menu.Item as={StyledMenuItem}>
              <MenuButton onClick={handleLogoutClick}>Log out</MenuButton>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  grid-area: main;
  height: 60px;
  padding: 0 32px;
  z-index: 100;
  border-top-right-radius: 10px;
  display: flex;
  align-items: center;
`;
const Background = styled.div<{ background: string; opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: -1;
  ${({ background, opacity }) =>
    `
      background: ${background};
      opacity: ${opacity};
    `}
`;
const Text = styled.div<{ opacity: number }>`
  color: #fff;
  font-size: 24px;
  font-weight: 400;
  line-height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  letter-spacing: 0.5px;
  opacity: 0;
  ${({ opacity }) =>
    `
      opacity: ${opacity};
    `}
`;
const DynamicContent = styled.div`
  display: flex;
  flex: 1;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;
const AccountButton = styled.div<{ open: boolean }>`
  transition: none;
  background-color: rgba(0, 0, 0, 0.7);
  border: 0;
  border-radius: 23px;
  color: #fff;
  cursor: pointer;
  height: 32px;
  margin-left: 16px;
  padding: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ open }) =>
    open &&
    `
      background: #282828;
    `}
`;
const AccountImage = styled.figure`
  display: inline-block;
  overflow: hidden;
  position: relative;
  width: 28px;
  height: 28px;
  img {
    border-radius: 50%;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;
const AccountName = styled.div`
  display: inline-block;
  line-height: 28px;
  margin-left: 8px;
  max-width: 110px;
  overflow: hidden;
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: normal;
  text-transform: none;
`;
const MenuButton = styled.button`
  display: flex;
  align-items: center;
  transition: none;
  background: transparent;
  outline: none;
  border: 0;
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.9);
  cursor: default;
  text-decoration: none;
  padding: 12px;
  width: 100%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    text-decoration: none;
  }
`;
const StyledMenu = styled.div`
  position: relative;
  border-radius: 4px;
`;
const StyledMenuButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
`;
const StyledMenuItems = styled.ul`
  width: 200px;
  outline: none;
  position: absolute;
  background: #282828;
  left: -2px;
  top: 40px;
  border-radius: 5px;
  padding: 2px 0;
`;
const StyledMenuItem = styled.li`
  cursor: default;
  position: relative;
  padding: 3px 0;
  margin: 0 5px;
  }
`;

export default StickyBar;
