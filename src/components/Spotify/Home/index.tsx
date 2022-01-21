import { FC, MutableRefObject, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import styled from 'styled-components';

import useFeedData from './useFeedData';
import homeMachine from './home.machine';
import PlaylistFeedCard from '../PlaylistFeedCard';
import { getGreetingByTime } from '../../../utils';
import useRect from '../../../hooks/useRect';
import TopSectionItem from '../TopSectionItem';

const Home: FC<{
  parentRef: MutableRefObject<HTMLDivElement | null>;
}> = ({ parentRef }) => {
  const feedData = useFeedData();
  const [state, send] = useMachine(homeMachine);
  const { data } = state.context;
  const { width } = useRect(parentRef, []);

  const newReleaseItems = data?.newReleases?.albums?.items;
  const featurePlaylists = data?.featurePlaylists?.playlists?.items;

  useEffect(() => {
    if (feedData) {
      send({ type: 'RECEIVED_DATA', data: feedData });
    }
  }, [send, feedData]);

  const items =
    width >= 1460
      ? newReleaseItems?.slice(0, 10)
      : width >= 1176
      ? newReleaseItems?.slice(0, 8)
      : width >= 892
      ? newReleaseItems?.slice(0, 6)
      : newReleaseItems?.slice(0, 4);

  if (!feedData) {
    return null;
  }

  return (
    <Wrapper>
      <div>
        <SectionWrapper>
          <SectionTitle>
            {getGreetingByTime(new Date().getHours())}
          </SectionTitle>
          <TopSectionContent>
            {items?.map((item) => {
              return <TopSectionItem key={item.id} item={item} />;
            })}
          </TopSectionContent>
        </SectionWrapper>
        <FeaturedSectionWrapper>
          <FeaturedSectionTitle>Featured Playlists</FeaturedSectionTitle>
          <SectionContent>
            {featurePlaylists?.map((item) => {
              return <PlaylistFeedCard key={item.id} listId={item.id} />;
            })}
          </SectionContent>
        </FeaturedSectionWrapper>
      </div>
    </Wrapper>
  );
};

export default Home;

const Wrapper = styled.div`
  grid-gap: 24px;
  display: grid;
  padding: 24px 32px;
`;
const SectionWrapper = styled.section`
  margin-bottom: 40px;
`;
const FeaturedSectionWrapper = styled(SectionWrapper)`
  margin-bottom: 40px;
`;
const SectionContent = styled.div`
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
`;
const TopSectionContent = styled.div`
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  row-gap: 16px;
`;
const SectionTitle = styled.h2`
  font-family: inherit;
  font-size: 32px;
  line-height: 36px;
  font-weight: 500;
  margin-bottom: 20px;
`;
const FeaturedSectionTitle = styled(SectionTitle)`
  font-size: 25px;
`;
