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
const PlaylistFeedCard = ({ listId }: Props) => {
  const service = useSpotifyContext();
  const [, send] = useActor(service);
  const currentTrackInfo = useSelector(service, selectCurrentTrack);
  const deviceId = useSelector(service, selectDeviceId);
  const listDetails = useListDetails('playlist', listId);
  const isSelectedPlaylistDiffFromTheOnePlaying =
    currentTrackInfo?.listId !== listDetails?.id;
  const isPlaying =
    currentTrackInfo?.listId === listDetails?.id &&
    !!currentTrackInfo?.isPlaying;

  const handleClick = () => {
    send({
      type: 'PLAYLIST',
      payload: {
        playlistId: listId,
        view: 'playlist',
      },
    });
  };

  const getBody = () => {
    const firstSong = listDetails?.tracks.items[0].track.uri;
    if (isSelectedPlaylistDiffFromTheOnePlaying) {
      return {
        context_uri: listDetails?.uri,
        offset: { uri: firstSong },
        position_ms: 0,
      };
    }

    return {
      context_uri: listDetails?.uri,
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
      imageSrc={listDetails?.images?.[0]?.url ?? ''}
      isPlaying={isPlaying}
      name={listDetails?.name ?? ''}
      onClick={handleClick}
      onPlayClick={handlePlayClick}
    />
  );
};

export default PlaylistFeedCard;
