import { FC, MutableRefObject } from 'react';
import styled from 'styled-components';
import useRect from '../../hooks/useRect';
import { FeedData } from './spotify.machine';
import TopSectionItem from './TopSectionItem';

const Home: FC<{
  parentRef: MutableRefObject<HTMLDivElement | null>;
  feedData: FeedData;
}> = ({ parentRef, feedData }) => {
  const { width } = useRect(parentRef, []);

  const newReleaseItems = feedData?.newReleases?.albums?.items;
  const featurePlaylists = feedData?.featurePlaylists?.playlists?.items;

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
              return <TopSectionItem item={item} />;
            })}
          </TopSectionContent>
        </SectionWrapper>
        <FeaturedPlaylistSectionWrapper>
          <SectionTitle>Feature Playlists</SectionTitle>
          <SectionContent>
            {featurePlaylists?.map((item) => {
              return (
                <FeedCard>
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
        </FeaturedPlaylistSectionWrapper>
        <FeaturedPlaylistSectionWrapper>
          <SectionTitle>Recommendations</SectionTitle>
          <SectionContent>
            {items?.map((item) => {
              return (
                <FeedCard>
                  <div style={{ flex: '1' }}>
                    <CardImage>
                      <img src={item?.images?.[2]?.url} alt="" />
                    </CardImage>
                    <div>
                      <Name>{item?.name}</Name>
                      <div>{item?.album_type}</div>
                    </div>
                  </div>
                </FeedCard>
              );
            })}
          </SectionContent>
        </FeaturedPlaylistSectionWrapper>
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
const FeaturedPlaylistSectionWrapper = styled(SectionWrapper)`
  margin-bottom: 40px;
`;

const SectionContent = styled.div`
  grid-gap: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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

const FeedCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #181818;
  padding: 15px 15px 30px;
  border-radius: 4px;
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
