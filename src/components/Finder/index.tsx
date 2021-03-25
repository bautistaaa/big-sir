import { FC, useState } from 'react';
import { RectResult } from '../../hooks/useRect';
import styled from 'styled-components/macro';
import Window from '../Window';
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

const Finder: FC<{
  minimizedTargetRect: RectResult;
  isFinderMinimized: boolean;
  setIsFinderMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ minimizedTargetRect, isFinderMinimized, setIsFinderMinimized }) => {
  const [view, setView] = useState<View>('Icon');
  const isIconView = view === 'Icon';
  const isDetailView = view === 'Detail';
  const isListView = view === 'List';

  return (
    <Window
      height={400}
      width={800}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isFinderMinimized}
      setIsWindowMinimized={setIsFinderMinimized}
    >
      <UtilityBar>
        <ButtonsWrapper>
          <LeftButton
            onClick={() => {
              setView('Icon');
            }}
            isActive={isIconView}
          >
            <Icons fill={isIconView ? 'rgb(64,64,64)' : 'white'} />
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
      <Wrapper>
        <SideBar>
          <Title>Favorites</Title>
          <Items>
            {SideBarItems.map((item) => {
              return (
                <Item>
                  <img src={SidebarItemIconMap[item.type]} alt="" />
                  <ItemName>{item.name}</ItemName>
                </Item>
              );
            })}
          </Items>
        </SideBar>
        <Content>
          {isIconView && <IconView files={files} />}
          {isListView && <ListView files={files} />}
          {isDetailView && <DetailView files={files} />}
        </Content>
      </Wrapper>
    </Window>
  );
};

const Content = styled.div`
  width: 100%;
  height: 100%;
  background: rgb(43, 43, 43);
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
  display: flex;
  height: calc(100% - 52px);
  width: 100%;
`;
const SideBar = styled.aside`
  height: 100%;
  width: 150px;
  background: rgb(73 73 73 / 70%);
  border-right: 1px solid black;
  padding: 5px;
  backdrop-filter: blur(5px);
`;
const UtilityBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 30px;
  width: 100%;
  background: rgb(56, 56, 56);
  padding: 5px 10px 10px;
  border-bottom: 1px solid black;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
`;
const BaseButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  width: 30px;
  height: 22px;
  background: rgb(107, 107, 107);
  margin-right: 1px;
  ${({ isActive }) =>
    isActive &&
    `
    background: rgb(204, 204, 204);
    `}
`;
const LeftButton = styled(BaseButton)`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;
const MiddleButton = styled(BaseButton)``;
const RightButton = styled(BaseButton)`
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;
const Title = styled.div`
  font-size: 10px;
  color: rgb(177, 177, 177);
  margin-bottom: 3px;
`;
export default Finder;
