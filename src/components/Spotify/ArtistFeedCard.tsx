import { useActor, useSelector } from '@xstate/react';
import FeedCard from './FeedCard';
import useListDetails from './hooks/useListDetails';
import { SelectorState } from './spotify.machine';
import { useSpotifyContext } from './SpotifyContext';
import { playTrack } from './utils';

interface Props {
  listId: string;
}

const selectCurrentTrack = (state: SelectorState) => state.context.currentTrack;
const selectDeviceId = (state: SelectorState) => state.context.deviceId;
const ArtistFeedCard = ({ listId }: Props) => {
  const service = useSpotifyContext();
  const [, send] = useActor(service);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const deviceId = useSelector(service, selectDeviceId);
  const artistDetails = useListDetails('artist', listId);
  const isSelectedPlaylistDiffFromTheOnePlaying =
    currentTrackInfo?.listId !== artistDetails?.tracks?.[0]?.artists?.[0]?.id;
  const isPlaying =
    currentTrackInfo?.listId === artistDetails?.tracks?.[0]?.artists?.[0]?.id &&
    !!currentTrackInfo?.isPlaying;
  const uris = artistDetails?.tracks?.map((track) => track.uri);

  const handleClick = () => {
    send({
      type: 'ARTIST',
      payload: {
        artistId: listId,
        view: 'artist',
      },
    });
  };

  const getBody = () => {
    const firstSong = artistDetails?.tracks?.[0].uri;
    if (isSelectedPlaylistDiffFromTheOnePlaying) {
      return {
        uris,
        offset: { uri: firstSong },
        position_ms: 0,
      };
    }

    return {
      uris,
      offset: {
        uri: `spotify:track:${currentTrackInfo?.trackId}` ?? firstSong,
      },
      position_ms: currentTrackInfo?.position,
    };
  };
  const handlePlayClick = () => {
    const method = isPlaying ? 'pause' : 'play';
    playTrack({ method, deviceId, body: getBody() });
  };

  return (
    <FeedCard
      imageSrc={artistDetails?.tracks?.[0]?.album?.images?.[0]?.url ?? ''}
      isPlaying={isPlaying}
      name={artistDetails?.tracks?.[0]?.artists?.[0]?.name ?? ''}
      onClick={handleClick}
      onPlayClick={handlePlayClick}
    />
  );
};

export default ArtistFeedCard;
