import infiniteScrollMachine, {
  InfiniteScrollMachineContext,
  InfiniteScrollMachineEvent,
} from './infinite-scroll.machine';

import spotifyConfig from '../../shared/config';
import { request } from './utils';
import { Sender } from 'xstate';

const DEFAULT_URL = `${spotifyConfig.apiUrl}/me/tracks?offset=0&limit=50`;
const fetchLikedTracks = (context: InfiniteScrollMachineContext) => async (
  send: Sender<InfiniteScrollMachineEvent>
) => {
  const url = context.next || DEFAULT_URL;
  const likedSongs: SpotifyApi.UsersSavedTracksResponse = await request(url);

  send({ type: 'RECEIVED_DATA', data: likedSongs });
};
const machine = infiniteScrollMachine.withConfig({
  services: { fetchLikedTracks },
});

export default machine;
