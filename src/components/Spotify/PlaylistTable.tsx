import { useRef, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import { useResizeDetector } from 'react-resize-detector';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components/macro';
import { AiOutlineClockCircle } from 'react-icons/ai';

import PlaylistTableItem from './PlaylistTableItem';

const PlaylistTable = ({ items }: { items: any }) => {
  const [activeTrack, setActiveTrack] = useState<string>('');
  // HELP: i couldnt figure out how to do this with sticky + intersection observer
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const wrapperWidth = useRef<number | undefined>();
  const uris = items?.map((x: any) => x?.track?.uri);
  const { ref: resizeRef } = useResizeDetector({
    onResize: () => {
      wrapperWidth.current = resizeRef.current.getBoundingClientRect().width;
    },
  });
  const { ref, inView } = useInView({
    initialInView: true,
    threshold: [1],
  });

  const onItemClick = (trackId: string) => {
    setActiveTrack(trackId);
  };

  return (
    <TableWrapper ref={mergeRefs([tableWrapperRef, resizeRef])}>
      <HeaderWrapper>
        <div
          ref={ref}
          style={{
            boxSizing: 'border-box',
            height: '30px',
            border: '1px solid transparent',
            position: 'absolute',
            top: '-60px',
          }}
        />
        <HeaderPositioner isSticky={!inView} width={wrapperWidth.current}>
          <Header isSticky={!inView}>
            <ColumnName>#</ColumnName>
            <ColumnName>Title</ColumnName>
            <ColumnName>Album</ColumnName>
            <ColumnName>Date Added</ColumnName>
            <ColumnName>
              <AiOutlineClockCircle stroke="#ffffff" size={16} />
            </ColumnName>
          </Header>
        </HeaderPositioner>
      </HeaderWrapper>
      <List isSticky={!inView}>
        {items.map((item: any, i: number) => {
          return (
            <PlaylistTableItem
              key={item.track?.id}
              item={item}
              index={i}
              uris={uris}
              onItemClick={onItemClick}
              activeTrack={activeTrack}
            />
          );
        })}
        <IntersectionDetection id="load-more" />
      </List>
    </TableWrapper>
  );
};

const IntersectionDetection = styled.div`
  pointer-events: none;
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1px solid red;
  left: 0;
  bottom: 30px;
`;

const TableWrapper = styled.div`
  position: relative;
  padding: 0 32px;
  a {
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    white-space: unset;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    color: #b3b3b3;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const List = styled.ol<{ isSticky: boolean }>`
  ${({ isSticky }) =>
    isSticky &&
    `
      padding-top: 54px;
    `}
`;
const HeaderWrapper = styled.div`
  position: relative;
  z-index: 99;
  transition: none;
`;
const HeaderPositioner = styled.div<{
  isSticky: boolean;
  width: number | undefined;
}>`
  margin: 0 -32px 16px;
  padding: 0 32px;
  height: 36px;
  z-index: 99;
  transition: none;
  position: relative;
  ${({ isSticky, width }) =>
    isSticky &&
    `
      background: #181818;
      border-bottom: 1px solid rgb(255 255 255 / 10%);
      position: fixed;
      top: 60px;
      width: ${width ?? 0}px;
    `}
`;
const Header = styled.div<{ isSticky: boolean }>`
  grid-gap: 16px;
  display: grid;
  padding: 0 16px;
  grid-template-columns: [index] 16px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(
      120px,
      1fr
    );
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
  color: #b3b3b3;
  height: 100%;
  transition: none;
  ${({ isSticky }) =>
    isSticky &&
    `
      border-bottom: none;
    `}
`;
const ColumnName = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.1em;
  line-height: 16px;
`;

export default PlaylistTable;
