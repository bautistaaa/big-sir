import {
  useState,
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
} from 'react';
import styled from 'styled-components/macro';
import { RectResult } from '../../hooks/useRect';
import { Icons, Details, List } from './icons/';
import Window from '../Window';
import IconView from './IconView';
import ListView from './ListView';
import DetailView from './DetailView';
import { RED, YELLOW, GREEN } from '../../shared/constants';
import { useAppContext } from '../../AppContext';
import useIsFocused from '../../hooks/useIsFocused';

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
  }
> = ({ minimizedTargetRect }, ref) => {
  const { state, dispatch } = useAppContext();
  const isMinimized = !!state.minimizedWindows.find(
    (mw) => mw.name === 'finder'
  );
  const finderState = state.activeWindows.find((aw) => aw.name === 'finder');
  const [view, setView] = useState<View>('Icon');
  const isIconView = view === 'Icon';
  const isDetailView = view === 'Detail';
  const isListView = view === 'List';

  const { isFocused: isFinderFocused } = useIsFocused(ref as any);

  useEffect(() => {
    if (isFinderFocused) {
      dispatch({
        type: 'focusWindow',
        payload: { name: 'finder', ref: ref as any },
      });
    }
  }, [isFinderFocused, dispatch, ref]);

  const handleMinimizeClick = () => {
    dispatch({ type: 'minimizedWindow', payload: { name: 'finder' } });
  };
  const handleCloseClick = () => {
    dispatch({ type: 'removeWindow', payload: { name: 'finder' } });
  };

  return (
    <Window
      height={400}
      width={800}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isMinimized}
      zIndex={finderState?.zIndex}
    >
      <Wrapper isWindowMinimized={isMinimized} ref={ref}>
        <TopBar className="action-bar">
          <LeftSide>
            <ActionBar>
              <CloseButton onClick={handleCloseClick} />
              <MinimizeButton onClick={handleMinimizeClick} />
              <FullScreenButton />
            </ActionBar>
          </LeftSide>
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
    </Window>
  );
};

const TopBar = styled.div`
  display: flex;
  height: 50px;
  width: calc(100% + 150px);
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
  background: rgb(59, 52, 56);
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
const Wrapper = styled.div<{
  isWindowMinimized: boolean;
}>`
  ${({ isWindowMinimized }) =>
    isWindowMinimized
      ? `transform: scale(0.2); opacity: 0;`
      : `transform: scale(1); opacity: 1;`}
  transition: transform .7s, opacity .4s;
  transform-origin: top left;
  width: calc(100% - 150px);
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
  // box-shadow: inset 0px 0px 0px 0.3px rgb(255 255 255 / 35%);
  border-bottom-left-radius: 12px;
  background: rgb(42 42 42 / 65%);
  backdrop-filter: blur(12px);
  &::after {
    content: '';
    position: absolute;
    // background: black;
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
  // clip-path: inset(0px 0px 0px 2px);
  // box-shadow: inset 0px 0px 0px 0.3px rgb(255 255 255 / 35%);
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
  width: calc(100% + 150px);
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
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: rgb(41, 35, 38);
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

export default forwardRef(Finder);
