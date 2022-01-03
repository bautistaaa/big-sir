import { FC, MutableRefObject, useEffect } from 'react';
import { useMachine, useService } from '@xstate/react';
import styled from 'styled-components';

import useFeedData from './useFeedData';
import homeMachine from './home.machine';
import { Context, SpotifyEvent } from '../spotify.machine';
import FeedCard from '../FeedCard';
import { getGreetingByTime } from '../../../utils';
import useRect from '../../../hooks/useRect';
import TopSectionItem from '../TopSectionItem';
import { useSpotifyContext } from '../SpotifyContext';

const Home: FC<{
  parentRef: MutableRefObject<HTMLDivElement | null>;
}> = ({ parentRef }) => {
  const service = useSpotifyContext();
  const [, sendParent] = useService<Context, SpotifyEvent>(service);
  const feedData = useFeedData();
  const [state, send] = useMachine(homeMachine);
  const { data } = state.context;
  const { width } = useRect(parentRef, []);

  const newReleaseItems = data?.newReleases?.albums?.items;
  const featurePlaylists = data?.featurePlaylists?.playlists?.items;
  const trackRecommendations = data?.trackRecommendations?.tracks;

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
              return (
                <FeedCard
                  key={item.id}
                  imageSrc={item?.images?.[0]?.url}
                  name={item?.name}
                  onClick={() => {
                    sendParent({
                      type: 'PLAYLIST',
                      payload: { playlistId: item.id, view: 'playlist' },
                    });
                  }}
                />
              );
            })}
          </SectionContent>
        </FeaturedSectionWrapper>
        <FeaturedSectionWrapper>
          <FeaturedSectionTitle>Recommendations</FeaturedSectionTitle>
          <SectionContent>
            {trackRecommendations?.map((item) => {
              return (
                <FeedCard
                  key={item.id}
                  /* @ts-ignore */
                  imageSrc={item?.album?.images?.[1]?.url}
                  name={item?.name}
                  onClick={() => {}}
                />
              );
            })}
          </SectionContent>
        </FeaturedSectionWrapper>
      </div>
      <section></section>
      <section></section>
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
