import { FC, memo, MutableRefObject } from 'react';
import { useSelector } from '@xstate/react';
import styled from 'styled-components';
import useRect from '../../hooks/useRect';
import { SelectorState } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import TopSectionItem from './TopSectionItem';

const selectFeedData = (state: SelectorState) => state.context.feedData;

const Home: FC<{
  parentRef: MutableRefObject<HTMLDivElement | null>;
}> = memo(({ parentRef }) => {
  const service = useSpotifyContext();
  const feedData = useSelector(service, selectFeedData);
  const { width } = useRect(parentRef, []);

  const newReleaseItems = feedData?.newReleases?.albums?.items;
  const featurePlaylists = feedData?.featurePlaylists?.playlists?.items;
  const trackRecommendations = feedData?.trackRecommendations?.tracks;

  const items =
    width >= 1460
      ? newReleaseItems?.slice(0, 10)
      : width >= 1176
      ? newReleaseItems?.slice(0, 8)
      : width >= 892
      ? newReleaseItems?.slice(0, 6)
      : newReleaseItems?.slice(0, 4);

  return (
    <Wrapper>
      <div>
        <SectionWrapper>
          <SectionTitle>Good Afternoon</SectionTitle>
          <TopSectionContent>
            {items?.map((item) => {
              return <TopSectionItem key={item.id} item={item} />;
            })}
          </TopSectionContent>
        </SectionWrapper>
        <FeaturedSectionWrapper>
          <FeaturedSectionTitle>Feature Playlists</FeaturedSectionTitle>
          <SectionContent>
            {featurePlaylists?.map((item) => {
              return (
                <FeedCard key={item.id}>
                  <div style={{ flex: '1' }}>
                    <CardImage>
                      <img src={item?.images?.[0]?.url} alt="" />
                    </CardImage>
                    <div>
                      <div>{item?.name}</div>
                    </div>
                  </div>
                </FeedCard>
              );
            })}
          </SectionContent>
        </FeaturedSectionWrapper>
        <FeaturedSectionWrapper>
          <FeaturedSectionTitle>Recommendations</FeaturedSectionTitle>
          <SectionContent>
            {trackRecommendations?.map((item) => {
              return (
                <FeedCard key={item.id}>
                  <div style={{ flex: '1' }}>
                    <CardImage>
                      {/* @ts-ignore */}
                      <img src={item?.album.images?.[1]?.url} alt="" />
                    </CardImage>
                    <div>
                      <Name>{item?.name}</Name>
                    </div>
                  </div>
                </FeedCard>
              );
            })}
          </SectionContent>
        </FeaturedSectionWrapper>
      </div>
      <section></section>
      <section></section>
    </Wrapper>
  );
});

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
const FeedCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #181818;
  padding: 15px 15px 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background: #282828;
  }
`;
const CardImage = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 30px;
  img {
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0) scale(1, 1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;
const Name = styled.div`
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
`;
