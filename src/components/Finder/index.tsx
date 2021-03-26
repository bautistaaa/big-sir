import { useState, ForwardRefRenderFunction, forwardRef } from 'react';
import { RectResult } from '../../hooks/useRect';
import styled from 'styled-components/macro';
import Window from '../Window';
import IconView from './IconView';
import ListView from './ListView';
import DetailView from './DetailView';
import { RED, YELLOW, GREEN } from '../../shared/constants';
import { useAppContext } from '../../AppContext';

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

const Finder: ForwardRefRenderFunction<
  HTMLDivElement,
  {
    minimizedTargetRect: RectResult;
    isFinderMinimized: boolean;
    setIsFinderMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ minimizedTargetRect, isFinderMinimized, setIsFinderMinimized }, ref) => {
  const { dispatch } = useAppContext();
  const [view, setView] = useState<View>('Icon');
  const isIconView = view === 'Icon';
  const isDetailView = view === 'Detail';
  const isListView = view === 'List';

  const handleMinimizeClick = () => {
    setIsFinderMinimized(true);
  };
  const handleCloseClick = () => {
    dispatch({ type: 'removeWindow', payload: { name: 'finder' } });
  };

  return (
    <Window
      height={400}
      width={800}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isFinderMinimized}
    >
      <Wrapper isWindowMinimized={isFinderMinimized} ref={ref}>
        <Sidebar>
          <ActionBar>
            <CloseButton onClick={handleCloseClick} />
            <MinimizeButton onClick={handleMinimizeClick} />
            <FullScreenButton />
          </ActionBar>
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
        </Sidebar>
        <Content>
          <UtilityBar></UtilityBar>
          {isIconView && <IconView files={files} />}
          {isListView && <ListView files={files} />}
          {isDetailView && <DetailView files={files} />}
        </Content>
      </Wrapper>
    </Window>
  );
};

const UtilityBar = styled.div`
  padding-left: 10px;
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
const Wrapper = styled.div<{
  isWindowMinimized: boolean;
}>`
  ${({ isWindowMinimized }) =>
    isWindowMinimized
      ? `transform: scale(0.2); opacity: 0;`
      : `transform: scale(1); opacity: 1;`}
  transition: transform .7s, opacity .4s;
  transform-origin: top left;
  width: 100%;
  height: 100%;
  z-index: 100;
`;
const Sidebar = styled.div`
  padding: 15px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 150px;
  box-shadow: inset 0px 0px 0px 0.3px rgb(255 255 255 / 35%);
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background: rgb(42 42 42 / 65%);
  backdrop-filter: blur(12px);
  &::after {
    content: '';
    position: absolute;
    background: black;
    height: 100%;
    width: 1px;
    top: 0;
    right: 0;
    bottom: 0;
  }
`;
const Content = styled.div`
  margin-left: 148px;
  background: rgb(41, 35, 38);
  width: 100%;
  height: 100%;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  clip-path: inset(0px 0px 0px 2px);
  box-shadow: inset 0px 0px 0px 0.3px rgb(255 255 255 / 35%);
`;
const Title = styled.div`
  font-size: 10px;
  color: rgb(177, 177, 177);
  margin-bottom: 3px;
`;
const BaseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  & + & {
    margin-left: 5px;
  }
`;
const CloseButton = styled(BaseButton)`
  background: ${RED};
`;
const MinimizeButton = styled(BaseButton)`
  background: ${YELLOW};
`;
const FullScreenButton = styled(BaseButton)`
  background: ${GREEN};
`;
const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  height: 22px;
  padding: 7px;
  margin-bottom: 10px;
`;

export default forwardRef(Finder);
