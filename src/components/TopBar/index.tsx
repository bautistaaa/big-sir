import { FC } from 'react';
import styled from 'styled-components';
import { Menu } from '@headlessui/react';
import { Apple } from './icons';
import CommandPanel from './CommandPanel';
import Clock from './Clock';
import { useAppContext } from '../../AppContext';
import { useActor } from '@xstate/react';

const TopBar: FC = () => {
  const service = useAppContext();
  const [, send] = useActor(service);

  const handleAboutThisMacClick = () => {
    send({
      type: 'FOCUS_WINDOW',
      payload: { name: 'aboutThisMac' },
    });
  };
  const handleAboutThisDeveloperClick = () => {
    send({
      type: 'FOCUS_WINDOW',
      payload: { name: 'aboutThisDeveloper' },
    });
  };
  const handleLogoutClick = () => {
    send({
      type: 'TOGGLE_AUTHENTICATION',
    });
  };
  return (
    <Wrapper>
      <LeftSide>
        <Menu as={StyledMenu}>
          <Menu.Button as={StyledMenuButton}>
            <Apple />
          </Menu.Button>
          <Menu.Items as={StyledMenuItems}>
            <Menu.Item as={StyledMenuItem}>
              <MenuButton onClick={handleAboutThisMacClick}>
                About This Mac
              </MenuButton>
            </Menu.Item>
            <Menu.Item as={StyledMenuItem}>
              <Separator />
            </Menu.Item>
            <Menu.Item as={StyledMenuItem}>
              <MenuButton onClick={handleAboutThisDeveloperClick}>
                About This Developer
              </MenuButton>
            </Menu.Item>
            <Menu.Item as={StyledMenuItem}>
              <MenuButton onClick={handleLogoutClick}>Log Out...</MenuButton>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </LeftSide>
      <RightSide>
        <CommandPanel />
        <Clock />
      </RightSide>
    </Wrapper>
  );
};

const MenuButton = styled.div`
  transition: none;
  padding: 5px 9px;
  position: relative;
  border-radius: 4px;
  &:hover {
    background: rgb(26, 109, 196);
    color: white;
  }
`;
const StyledMenu = styled.div`
  position: relative;
`;
const StyledMenuButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
`;
const StyledMenuItems = styled.ul`
  outline: none;
  position: absolute;
  background: ${({ theme }) => theme.menuBackground};
  backdrop-filter: blur(72px);
  box-shadow: inset 0px 0px 0px 0.4px rgb(255 255 255 / 35%);
  left: 0;
  top: 24px;
  border-radius: 5px;
  width: 260px;
  padding: 2px 0;
`;
const StyledMenuItem = styled.li`
  cursor: default;
  position: relative;
  padding: 3px 0;
  margin: 0 5px;
`;
const Separator = styled.div`
  position: relative;
  width: 94%;
  left: 8px;
  padding: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  height: 1px;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  width: 100%;
  color: ${({ theme }) => theme.color};
  background: rgb(51 51 51 / 25%);
  padding: 0 15px;
  font-size: 12px;
  letter-spacing: 0.3px;
  font-weight: 500;
  backdrop-filter: blur(72px);
  position: relative;
  z-index: 2000;
`;
const LeftSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const RightSide = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default TopBar;
