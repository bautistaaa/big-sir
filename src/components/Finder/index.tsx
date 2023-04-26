import { useMachine } from '@xstate/react';
import { useState } from 'react';
import styled from 'styled-components/macro';
import getDirectoryContents from '../../utils/getDirectoryContents';
import { Maximizable } from '../Window';
import DetailView from './DetailView';
import finderMachine from './finder.machine';
import IconView from './IconView';
import ListView from './ListView';
import UtilityBar from './UtilityBar';

export const FileIconMap: { [k: string]: string } = {
  text: 'file.png',
};
export type FileType = 'text' | 'folder' | 'image';
const SidebarItemIconMap: { [k: string]: string } = {
  directory: 'sidebar-folder.png',
  desktop: 'path.png',
  applications: 'path.png',
};

interface Props extends Maximizable {}
const Finder = ({ handleMaximize }: Props) => {
  const [current, send] = useMachine(finderMachine, { devTools: true });
  const [activeFolder, setActiveFolder] = useState('personal');
  const files = getDirectoryContents(
    current.context.directories[current.context.activeDirectory].path
  );
  const isIconView = current.matches('icons');
  const isListView = current.matches('lists');
  const isDetailView = current.matches('details');

  return (
    <Wrapper>
      <Explorer>
        <InvisibleDraggableBar className="action-bar" />
        <Sidebar>
          <Title>Favorites</Title>
          <Items>
            {Object.keys(current.context.directories).map((k, i) => {
              return (
                <Item
                  key={i}
                  active={activeFolder === k}
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
                  <img
                    src={
                      SidebarItemIconMap[current.context.directories[k].type]
                    }
                    alt=""
                  />
                  <ItemName>{k}</ItemName>
                </Item>
              );
            })}
          </Items>
        </Sidebar>
      </Explorer>
      <RightSide>
        <UtilityBar
          folderName={activeFolder.toString()}
          current={current}
          send={send}
          handleMaximize={handleMaximize}
        />
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
  width: 180px;
  height: 100%;
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
const Items = styled.div``;
const Item = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: default;
  border-radius: 5px;
  padding: 6px 8px;
  img {
    height: 18px;
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
  padding: 58px 10px 0;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 180px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  border-right: 1px solid ${({ theme }) => theme.finderDetailsBorder};
  background: ${({ theme }) => theme.finderSideBarBackground};
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
  background: ${({ theme }) => theme.finderBackground};
  width: 100%;
  height: 100%;
  border-bottom-right-radius: 12px;
  overflow: auto;
`;
const Title = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: rgb(177, 177, 177);
  margin-bottom: 3px;
  padding-left: 3px;
`;

export default Finder;
