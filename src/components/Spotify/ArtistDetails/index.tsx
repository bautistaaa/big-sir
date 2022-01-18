import { useActor, useMachine, useSelector } from '@xstate/react';
import { useEffect } from 'react';
import styled from 'styled-components/macro';

import useListDetails from '../hooks/useListDetails';
import { SelectorState } from '../spotify.machine';
import { useSpotifyContext } from '../SpotifyContext';
import createArtistDetailsMachine from './artistDetails.machine';
import PopularTracks from './PopularTracks';
import ArtistAlbums from './ArtistAlbums';

const selectArtistId = (state: SelectorState) => state.context.currentListId;

const ArtistDetails = () => {
  const service = useSpotifyContext();
  const [, parentSend] = useActor(service);
  const artistId = useSelector(service, selectArtistId);
  const [
    {
      context: { artistDetails, artistAlbums },
    },
  ] = useMachine(createArtistDetailsMachine(artistId ?? ''));

  const songs = useListDetails('artist', artistId ?? '');

  useEffect(() => {
    parentSend({
      type: 'TRANSITION_HEADER',
      payload: {
        backgroundColor: 'transparent',
        text: 'artist',
      },
    });
  }, [parentSend]);

  useEffect(() => {
    if (artistDetails) {
      parentSend({
        type: 'ARTIST_UPDATE',
        payload: {
          artist: artistDetails,
          isPlaying: false,
        },
      });
    }
  }, [artistDetails, parentSend]);

  return (
    <Wrapper>
      <ImageWrapper imageUrl={artistDetails?.images?.[0]?.url ?? ''}>
        <ImageOverlay />
      </ImageWrapper>
      <Hero>
        <PlaylistInfo>
          <Title id="title">{artistDetails?.name}</Title>
          <Followers>
            {new Intl.NumberFormat().format(
              artistDetails?.followers?.total ?? 0
            )}{' '}
            Followers
          </Followers>
        </PlaylistInfo>
      </Hero>
      <ContentWrapper>
        {songs?.tracks && <PopularTracks tracks={songs?.tracks} />}
        {artistAlbums?.items && <ArtistAlbums albums={artistAlbums.items} />}
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: -60px;
`;
const ContentWrapper = styled.div`
  padding: 24px 32px 0;
`;
const Hero = styled.div`
  position: relative;
  height: 40vh;
  max-height: none;
  display: flex;
`;
const ImageWrapper = styled.div<{ imageUrl: string }>`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
  height: 40vh;
  background-image: url(${({ imageUrl }) => imageUrl});
  content-visibility: auto;
  background-attachment: scroll;
  background-position: 50% 15%;
  background-repeat: no-repeat;
  background-size: cover;
  contain: strict;
`;
const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: linear-gradient(transparent 0, rgba(0, 0, 0, 0.5) 100%);
`;
const PlaylistInfo = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column;
  justify-content: flex-end;
  padding: 0 32px 24px;
`;
const Title = styled.div`
  font-size: 96px;
  font-weight: 600;
  line-height: 96px;
  padding: 5px 0;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  text-align: left;
  width: 100%;
  word-break: break-word;
`;

const Followers = styled.div`
  font-size: 16px;
  line-height: 2;
  margin-top: 4px;
`;

export default ArtistDetails;
