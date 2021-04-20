import { useState, FC } from 'react';
import styled from 'styled-components/macro';
import { Icons, Details, List } from './icons/';
import IconView from './IconView';
import ListView from './ListView';
import DetailView from './DetailView';

export const FileIconMap: { [k: string]: string } = {
  text: 'file.png',
};
export const files: File[] = [
  {
    name: 'Resume.js',
    type: 'text',
    lastOpened: 'Sep 27, 2020 at 8:41 PM',
  },
  {
    name: 'Resume.js',
    type: 'text',
    lastOpened: 'Sep 27, 2020 at 8:41 PM',
  },
  {
    name: 'Resume.js',
    type: 'text',
    lastOpened: 'Sep 27, 2020 at 8:41 PM',
  },
];
export type FileType = 'text' | 'folder' | 'image';
export interface File {
  name: string;
  type: FileType;
  lastOpened: string;
}
const SidebarItemIconMap: { [k: string]: string } = {
  directory: 'sidebar-folder.png',
  desktop: 'path.png',
  applications: 'path.png',
};
type ItemType = 'directory' | 'desktop' | 'applications';
interface SidebarItem {
  name: string;
  type: ItemType;
}
const SideBarItems: SidebarItem[] = [
  {
    name: 'workspace',
    type: 'directory',
  },
];
type View = 'Icon' | 'Detail' | 'List';

const Finder: FC = () => {
  const [view, setView] = useState<View>('Icon');
  const isIconView = view === 'Icon';
  const isDetailView = view === 'Detail';
  const isListView = view === 'List';

  return (
    <Wrapper>
      <TopBar className="action-bar">
        <LeftSide></LeftSide>
        <RightSide>
          <UtilityBar>
            <ButtonsWrapper>
              <LeftButton
                onClick={() => {
                  setView('Icon');
                }}
                isActive={isIconView}
              >
                <Icons />
              </LeftButton>
              <MiddleButton
                onClick={() => {
                  setView('List');
                }}
                isActive={isListView}
              >
                <List stroke={isListView ? 'rgb(64,64,64)' : 'white'} />
              </MiddleButton>
              <RightButton
                onClick={() => {
                  setView('Detail');
                }}
                isActive={isDetailView}
              >
                <Details stroke={isDetailView ? 'rgb(64,64,64)' : 'white'} />
              </RightButton>
            </ButtonsWrapper>
          </UtilityBar>
        </RightSide>
      </TopBar>
      <Bottom>
        <Sidebar>
          <Title>Favorites</Title>
          <Items>
            {SideBarItems.map((item, i) => {
              return (
                <Item key={i}>
                  <img src={SidebarItemIconMap[item.type]} alt="" />
                  <ItemName>{item.name}</ItemName>
                </Item>
              );
            })}
          </Items>
        </Sidebar>
        <Content>
          {isIconView && <IconView files={files} />}
          {isListView && <ListView files={files} />}
          {isDetailView && <DetailView files={files} />}
        </Content>
      </Bottom>
    </Wrapper>
  );
};

const TopBar = styled.div`
  display: flex;
  height: 50px;
`;
const LeftSide = styled.div`
  width: 150px;
  height: 100%;
  background: rgb(42 42 42 / 65%);
  border-top-left-radius: 12px;
  padding-left: 10px;
  padding-top: 10px;
  backdrop-filter: blur(12px);
`;
const RightSide = styled.div`
  background: rgb(56, 56, 60);
  width: calc(100% - 150px);
  border-top-right-radius: 12px;
`;
const UtilityBar = styled.div`
  height: 100%;
`;
const Items = styled.div`
  padding-left: 10px;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #ffffff;
  img {
    height: 20px;
    margin-right: 5px;
  }
`;
const ItemName = styled.div`
  color: #ffffff;
  font-size: 12px;
`;
const Wrapper = styled.div`
  transform-origin: top left;
  height: 100%;
  z-index: 100;
  border-radius: 12px;
  box-shadow: rgb(0 0 0 / 30%) 0px 15px 20px, rgb(0 0 0 / 32%) 0px 18px 20px 5px;
`;
const Sidebar = styled.div`
  padding: 15px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 150px;
  border-bottom-left-radius: 12px;
  background: rgb(42 42 42 / 65%);
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
  margin-left: 150px;
  background: rgb(41, 35, 38);
  width: 100%;
  height: 100%;
  border-bottom-right-radius: 12px;
`;
const Title = styled.div`
  font-size: 10px;
  color: rgb(177, 177, 177);
  margin-bottom: 3px;
`;
const Bottom = styled.div`
  position: relative;
  display: flex;
  height: calc(100% - 50px);
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-top-right-radius: 12px;
`;
const BaseUtilButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  width: 30px;
  height: 22px;
  background: rgb(41, 35, 38);
  margin-right: 1px;
  z-index: 120;
  border-radius: 5px;
  ${({ isActive }) =>
    isActive &&
    `
    background: rgb(54, 54, 54);
    `}
`;
const LeftButton = styled(BaseUtilButton)``;
const MiddleButton = styled(BaseUtilButton)``;
const RightButton = styled(BaseUtilButton)``;

export default Finder;
