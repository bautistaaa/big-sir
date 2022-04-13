import { useMachine } from '@xstate/react';
import { FC, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components/macro';
import getDirectoryContents from '../../utils/getDirectoryContents';
import DetailView from './DetailView';
import finderMachine from './finder.machine';
import { Details, Icons, List } from './icons/';
import IconView from './IconView';
import ListView from './ListView';

export const FileIconMap: { [k: string]: string } = {
  text: 'file.png',
};
export type FileType = 'text' | 'folder' | 'image';
const SidebarItemIconMap: { [k: string]: string } = {
  directory: 'sidebar-folder.png',
  desktop: 'path.png',
  applications: 'path.png',
};
type ItemType = 'directory' | 'desktop' | 'applications';
interface SidebarItem {
  type: ItemType;
  path: string[];
}
const SideBarItems: Record<string, SidebarItem> = {
  personal: {
    type: 'directory',
    path: ['home', 'personal'],
  },
  projects: {
    type: 'directory',
    path: ['home', 'projects'],
  },
};

const Finder: FC = () => {
  const [current, send] = useMachine(finderMachine, { devTools: true });
  const [activeFolder, setActiveFolder] = useState('personal');
  const themeContext = useContext(ThemeContext);
  const files = getDirectoryContents(
    SideBarItems[current.context.activeDirectory].path
  );
  const isIconView = current.matches('icons');
  const isDetailView = current.matches('details');
  const isListView = current.matches('lists');

  return (
    <Wrapper>
      <Explorer>
        <InvisibleDraggableBar className="action-bar" />
        <Sidebar>
          <Title>Favorites</Title>
          <Items>
            {Object.keys(SideBarItems).map((k, i) => {
              return (
                <Item key={i} active={activeFolder === k}>
                  <img src={SidebarItemIconMap[SideBarItems[k].type]} alt="" />
                  <ItemName
                    onClick={() => {
                      setActiveFolder(k);
                      send({
                        type: 'DIRECTORY_CHANGED',
                        payload: {
                          name: k,
                        },
                      });
                    }}
                  >
                    {k}
                  </ItemName>
                </Item>
              );
            })}
          </Items>
        </Sidebar>
      </Explorer>
      <RightSide>
        <UtilityBar className="action-bar">
          <ButtonsWrapper>
            <LeftButton
              onClick={() => {
                send('ICONS');
              }}
              isActive={isIconView}
            >
              <Icons
                fill={themeContext.finderIconFill}
                backgroundFill={themeContext.finderModeButtonBackground}
              />
            </LeftButton>
            <MiddleButton
              onClick={() => {
                send('LISTS');
              }}
              isActive={isListView}
            >
              <List fill={themeContext.finderIconFill} />
            </MiddleButton>
            <RightButton
              onClick={() => {
                send('DETAILS');
              }}
              isActive={isDetailView}
            >
              <Details fill={themeContext.finderIconFill} />
            </RightButton>
          </ButtonsWrapper>
        </UtilityBar>
        <Content>
          {isIconView && <IconView files={files} />}
          {isListView && <ListView files={files} />}
          {isDetailView && <DetailView files={files} />}
        </Content>
      </RightSide>
    </Wrapper>
  );
};

const Explorer = styled.div`
  position: relative;
  width: 150px;
  height: 100%;
  background: rgb(42 42 42 / 65%);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-left: 10px;
  padding-top: 10px;
  backdrop-filter: blur(12px);
`;
const RightSide = styled.div<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: ${({ theme }) => theme.finderTopBarBackground};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  flex: 1;
`;
const InvisibleDraggableBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
`;
const UtilityBar = styled.div`
  height: 50px;
  min-height: 50px;
  width: 100%;
`;
const Items = styled.div``;
const Item = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: default;
  border-radius: 5px;
  padding: 6px 8px;
  img {
    height: 15px;
    margin-right: 5px;
  }
  ${({ active }) =>
    active &&
    `
    background: rgb(180 180 180 / 22%) !important;
  `}
`;
const ItemName = styled.div`
  font-size: 12px;
`;
const Wrapper = styled.div`
  display: flex;
  height: 100%;
  border-radius: inherit;
  div {
    color: ${({ theme }) => theme.color};
  }
`;
const Sidebar = styled.div<{ theme: any }>`
  padding: 62px 10px 0;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 150px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background: ${({ theme }) => theme.finderSideBarBackground};
  backdrop-filter: blur(12px);
  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    right: 0;
    bottom: 0;
  }
`;
const Content = styled.div`
  background: ${({ theme }) => theme.finderSideBarBackground};
  width: 100%;
  height: 100%;
  border-bottom-right-radius: 12px;
  overflow: auto;
`;
const Title = styled.div`
  font-size: 10px;
  color: rgb(177, 177, 177);
  margin-bottom: 3px;
  padding-left: 3px;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-top-right-radius: 12px;
`;
const BaseUtilButton = styled.button<{ isActive: boolean; theme: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  width: 30px;
  height: 22px;
  margin-right: 1px;
  z-index: 120;
  border-radius: 5px;
  ${({ isActive, theme }) =>
    isActive &&
    `
    background: ${theme.finderModeButtonBackground};
    `}
`;
const LeftButton = styled(BaseUtilButton)``;
const MiddleButton = styled(BaseUtilButton)``;
const RightButton = styled(BaseUtilButton)``;

export default Finder;
