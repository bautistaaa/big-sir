import { FC, useEffect, useRef, useState } from 'react';
import ColorThief from 'colorthief';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components/macro';
import { MdPlayArrow } from 'react-icons/md';
import { IoMdHeart } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { useSpotifyContext } from './SpotifyContext';
import PlaylistTable from './PlaylistTable';
import { useService } from '@xstate/react';
import { Context } from './spotify.machine';

const colorThief = new ColorThief();

const convertToRgb = (rgb: number[]) =>
  `rgb(${rgb?.[0]},${rgb?.[1]}, ${rgb?.[2]} )`;
const PlaylistDetails: FC<{
  playlist: SpotifyApi.PlaylistObjectFull | undefined;
}> = ({ playlist }) => {
  const [heroBackgroundColor, setHeroBackgrounColor] = useState<string>();
  const imageColor = useRef<number[]>([]);
  const service = useSpotifyContext();
  const [,send] = useService<Context, any>(service);
  const { ref: titleRef, entry } = useInView({
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  });
  const imageSrc = playlist?.images?.[0]?.url;
  const items = playlist?.tracks?.items;

  useEffect(() => {
    const downloadedImg = new Image();

    const imageReceived = () => {
      const validColors = colorThief
        .getPalette(downloadedImg)
        .filter(
          (color) => color?.[0] < 200 && color?.[1] < 200 && color?.[2] < 200
        );

      if (validColors.length) {
        imageColor.current = validColors[0];
      } else {
        imageColor.current = [0, 0, 0];
      }
      const randomHeroColor =
        validColors[Math.floor(validColors.length * Math.random())];
      setHeroBackgrounColor(convertToRgb(randomHeroColor));
    };

    downloadedImg.crossOrigin = 'Anonymous';
    downloadedImg.addEventListener('load', imageReceived, false);
    downloadedImg.src = imageSrc as string;
    return () => {
      downloadedImg.removeEventListener('load', imageReceived, false);
    };
  }, [imageSrc]);

  useEffect(() => {
    const diff = 1 - (entry?.intersectionRatio ?? 0);
    send({
      type: 'TRANSITION_HEADER',
      payload: {
        backgroundColor: convertToRgb(imageColor.current),
        opacity: diff > 0.9 ? 1 : diff,
        playlistName: playlist?.name,
      },
    });
  }, [entry?.intersectionRatio, send, playlist?.name]);

  return (
    <Wrapper>
      <Hero background={heroBackgroundColor}>
        <Skrim />
        <ArtWrapper>
          <Art src={imageSrc}></Art>
        </ArtWrapper>
        <PlaylistInfo>
          <Category>{playlist?.type}</Category>
          <Title ref={titleRef}>{playlist?.name}</Title>
          <Description>{playlist?.description}</Description>
          <Metadata>
            <Author>{playlist?.owner?.display_name}</Author>
            {playlist && playlist.followers.total > 0 && (
              <Likes>
                {new Intl.NumberFormat().format(playlist.followers.total)} Likes
              </Likes>
            )}
            <Songs>
              {new Intl.NumberFormat().format(playlist?.tracks?.total ?? 0)}{' '}
              {(playlist?.tracks?.total ?? 0) > 1 ? 'Songs' : 'Song'}
            </Songs>
          </Metadata>
        </PlaylistInfo>
      </Hero>
      <UtilityBar>
        <UtilityButtonWrapper>
          <button>
            <MdPlayArrow color="white" size={40} />
          </button>
        </UtilityButtonWrapper>
        <UtilityButtonWrapper>
          <IoMdHeart fill="#1db954" size={32} />
        </UtilityButtonWrapper>
        <BsThreeDots fill="#a2a2a2" size={24} />
      </UtilityBar>
      {items && <PlaylistTable items={items} />}
    </Wrapper>
  );
};

const Wrapper = styled.div``;
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
const UtilityBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 32px;
`;
const UtilityButtonWrapper = styled.div`
  margin-right: 24px;
  button {
    z-index: 100;
    border: none;
    box-shadow: 0 8px 8px rgb(0 0 0 / 30%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 500px;
    background-color: #1db954;
    color: #fff;
    width: 55px;
    height: 55px;
  }
`;

export default PlaylistDetails;
