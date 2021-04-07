import { FC } from 'react';
import styled from 'styled-components/macro';
import { Menu } from '@headlessui/react';
import { Apple } from './icons';
import CommandPanel from './CommandPanel';
import Clock from './Clock';
import { useAppContext } from '../../AppContext';

const TopBar: FC<{ atmRef: any }> = ({ atmRef }) => {
  const { dispatch } = useAppContext();

  const handleAboutThisMacClick = () => {
    dispatch({
      type: 'focusWindow',
      payload: { name: 'aboutThisMac', ref: atmRef as any },
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
  padding: 5px 9px;
  position: relative;
  border-radius: 2px;
  &:hover {
    background: rgb(26, 109, 196);
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
  background: rgb(27 27 29 / 30%);
  backdrop-filter: blur(72px);
  box-shadow: inset 0px 0px 0px 0.4px rgb(255 255 255 / 35%);
  left: 0;
  top: 24px;
  padding: 5px;
  border-radius: 5px;
  width: 260px;
`;
const StyledMenuItem = styled.li`
  padding-bottom: 7px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  background: rgb(51 51 51 / 25%);
  padding: 0 15px;
  font-size: 12px;
  letter-spacing: 0.3px;
  font-weight: 500;
  backdrop-filter: blur(72px);
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default TopBar;
