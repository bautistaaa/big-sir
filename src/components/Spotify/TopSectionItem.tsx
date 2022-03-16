import { useActor, useSelector } from '@xstate/react';
import { useEffect, useState } from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import styled from 'styled-components';

import spotifyConfig from '../../shared/config';
import { SelectorState } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import { getToken, request } from './utils';

interface Props {
  item: SpotifyApi.AlbumObjectSimplified;
}
const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
/**
 * For the sake of finishing this we are going to assume
 * only albums use this component.
 */
const TopSectionItem = ({ item }: Props) => {
  const service = useSpotifyContext();
  const [, send] = useActor(service);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const deviceId = useSelector(service, selectDeviceId);
  const [albumDetails, setAlbumDetails] = useState<
    SpotifyApi.SingleAlbumResponse | undefined
  >();
  const firstTrack = albumDetails?.tracks?.items?.[0];
  const isPlaying =
    currentTrackInfo?.listId === albumDetails?.id &&
    !!currentTrackInfo?.isPlaying;

  useEffect(() => {
    const fetchTracks = async () => {
      const album: SpotifyApi.SingleAlbumResponse = await request(
        `${spotifyConfig.apiUrl}/albums/${item.id}`
      );
      setAlbumDetails(album);
    };

    fetchTracks();
  }, [item.id]);

  const handlePlayButtonClick = () => {
    const playOrPause = async () => {
      const method = isPlaying ? 'pause' : 'play';
      const body = {
        context_uri: albumDetails?.uri,
        offset: {
          uri: firstTrack?.uri,
        },
        position_ms: 0,
      };
      try {
        const token = getToken();
        const resp = await fetch(
          `https://api.spotify.com/v1/me/player/${method}?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resp.ok) {
          throw new Error('shit!');
        }
      } catch (e) {
        console.error(e);
      }
    };

    playOrPause();
  };

  const handleSectionItemClick = () => {
    send({
      type: 'ALBUM',
      payload: {
        albumId: item?.id,
        view: 'album',
      },
    });
  };
  return (
    <IntroSectionItem onClick={handleSectionItemClick}>
      <AlbumArt>
        <img src={item?.images?.[2]?.url} alt="" />
      </AlbumArt>
      <Metadata>
        <Title>{item?.name}</Title>
        <ButtonWrapper>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayButtonClick();
            }}
          >
            {isPlaying ? (
              <MdPause color="white" size={40} />
            ) : (
              <MdPlayArrow color="white" size={40} />
            )}
          </button>
        </ButtonWrapper>
      </Metadata>
    </IntroSectionItem>
  );
};

const ButtonWrapper = styled.div`
  opacity: 0;
  pointer-events: all;
  transition: opacity 0.3s ease;
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
    width: 40px;
    height: 40px;
  }
`;
const IntroSectionItem = styled.div`
  display: flex;
  background-color: hsla(0, 0%, 100%, 0.1);
  border-radius: 4px;
  height: 80px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background-color: #ffffff33;
    ${ButtonWrapper} {
      opacity: 1;
      &:hover {
        button {
          transform: scale(1.06);
        }
      }
    }
  }
  transition: background-color 0.3s ease;
`;
const AlbumArt = styled.div`
  height: 100%;
  width: 80px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Metadata = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  flex: 1;
`;
const Title = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.6px;
  white-space: nowrap;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
`;

export default TopSectionItem;
