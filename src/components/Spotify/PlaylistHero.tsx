import { memo } from 'react';
import styled from 'styled-components/macro';

interface PlaylistHeroProps {
  backgroundColor: string;
  image: string;
  category: string;
  title: string;
  description?: string;
  author: string;
  followers?: number;
  tracksTotal: number;
}

const PlaylistHero = ({
  backgroundColor,
  image,
  category,
  title,
  description,
  author,
  followers,
  tracksTotal,
}: PlaylistHeroProps) => {
  return (
    <Hero background={backgroundColor}>
      <Skrim />
      <ArtWrapper>{image && <Art src={image}></Art>}</ArtWrapper>
      <PlaylistInfo>
        <Category>{category}</Category>
        <Title id="title">{title}</Title>
        {description && <Description>{description}</Description>}
        <Metadata>
          <Author>{author}</Author>
          {followers && followers > 0 && (
            <Likes>{new Intl.NumberFormat().format(followers)} Likes</Likes>
          )}
          <Songs>
            {new Intl.NumberFormat().format(tracksTotal)}{' '}
            {(tracksTotal ?? 0) > 1 ? 'Songs' : 'Song'}
          </Songs>
        </Metadata>
      </PlaylistInfo>
    </Hero>
  );
};

const Hero = styled.div<{ background?: string }>`
  position: relative;
  display: flex;
  padding: 0 32px 24px;
  background: ${({ background }) => background ?? 'transparent'};
  height: 30vh;
  max-height: 500px;
  min-height: 340px;
`;
const Skrim = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
`;

const ArtWrapper = styled.div`
  z-index: 100;
  align-self: flex-end;
  width: 232px;
  margin-right: 24px;
`;
const Art = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 4px 60px rgb(0 0 0 / 50%);
`;
const PlaylistInfo = styled.div`
  z-index: 100;
  display: flex;
  flex: 1;
  flex-flow: column;
  justify-content: flex-end;
`;
const Category = styled.div`
  font-size: 14px;
  text-transform: uppercase;
`;
const Title = styled.div`
  font-size: 50px;
  font-weight: 600;
  line-height: 68px;
  padding: 5px 0;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-align: left;
  width: 100%;
  word-break: break-word;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 20px;
  text-transform: none;
  opacity: 0.7;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  display: inline-block;
  max-height: 74px;
  overflow: hidden;
  word-break: break-word;
`;
const Metadata = styled.div`
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  > div {
    margin-right: 4px;
  }
`;
const Author = styled.div``;
const Likes = styled.div`
  opacity: 0.7;
  letter-spacing: -0.6px;
`;
const Songs = styled.div`
  opacity: 0.7;
  letter-spacing: -0.6px;
`;

export default memo(PlaylistHero);
