import { useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';

interface PlaylistProps {
  items: SpotifyApi.PlaylistTrackObject[];
  onLoadMore(): void;
}

const PlaylistTableV2 = ({ items, onLoadMore }: PlaylistProps) => {
  console.log({ items });
  const listRef = useRef<HTMLDivElement | null>(null);
  const onScroll = useCallback(({ scrollTop }) => {
    console.log(listRef.current);
    listRef.current?.scrollTo(scrollTop);
  }, []);

  const Row = ({ index, style }: { index: number, style: any }) => {
    const trackData = items[index];
    console.log({
      trackData,
      index,
      style
    });
    return <div style={style}>{trackData?.track?.name}</div>;
  };

  return (
    <>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <InfiniteLoader
            isItemLoaded={(index) => items[index] !== undefined}
            itemCount={items.length + 1}
            loadMoreItems={onLoadMore}
          >
            {({ onItemsRendered, ref }) => (
              <List
                height={height}
                width={width}
                itemCount={items.length + 1}
                itemSize={30}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {Row}
              </List>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </>
  );
};

export { PlaylistTableV2 };
