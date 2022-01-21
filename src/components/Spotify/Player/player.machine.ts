import { assign, createMachine } from 'xstate';
import { getToken } from '../utils';

export type RepeatMode = 'off' | 'track' | 'context';
interface PlayerContext {
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  playerState?: Spotify.PlaybackState;
  repeatMode: RepeatMode;
}

type VolumeEvent = {
  type: 'VOLUME_UPDATE';
  payload: { volume: number };
};

type ShuffleEvent = {
  type: 'TOGGLE_SHUFFLE';
};

type RepeatEvent = {
  type: 'TOGGLE_REPEAT';
};

type MuteEvent = {
  type: 'TOGGLE_MUTE';
  payload: { value: boolean };
};

type PlayerStateEvent = {
  type: 'PLAYER_UPDATE';
  payload: { state: Spotify.PlaybackState };
};

type PlayerEvent =
  | PlayerStateEvent
  | VolumeEvent
  | ShuffleEvent
  | RepeatEvent
  | MuteEvent;

const token = getToken();
const playerMachine = createMachine<PlayerContext, PlayerEvent>(
  {
    id: 'player',
    initial: 'idle',
    context: {
      volume: 1,
      isMuted: false,
      isShuffle: false,
      repeatMode: 'off',
    },
    on: {
      TOGGLE_MUTE: {
        actions: assign<PlayerContext, MuteEvent>({
          isMuted: (_, event) => {
            return event.payload.value;
          },
        }),
      },
      PLAYER_UPDATE: {
        actions: assign<PlayerContext, PlayerStateEvent>((_, event) => {
          return {
            playerState: event.payload.state,
            isShuffle: event.payload.state?.shuffle,
          };
        }),
      },
      VOLUME_UPDATE: {
        actions: assign<PlayerContext, VolumeEvent>({
          volume: (_, event) => {
            return event.payload.volume;
          },
        }),
      },
    },
    states: {
      idle: {
        type: 'parallel',
        states: {
          shuffle: {
            initial: 'unknown',
            states: {
              unknown: {
                always: [
                  {
                    cond: 'isShuffleEnabled',
                    target: 'on',
                  },
                  {
                    target: 'off',
                  },
                ],
              },
              off: {
                entry: assign<PlayerContext, any>({
                  isShuffle: () => {
                    return false;
                  },
                }),
                invoke: {
                  src: 'shuffle',
                },
                on: { TOGGLE_SHUFFLE: 'on' },
              },
              on: {
                entry: assign<PlayerContext, any>({
                  isShuffle: () => {
                    return true;
                  },
                }),
                invoke: {
                  src: 'shuffle',
                },
                on: { TOGGLE_SHUFFLE: 'off' },
              },
            },
          },
          repeatMode: {
            initial: 'off',
            states: {
              off: {
                entry: assign<PlayerContext, any>({
                  repeatMode: () => {
                    return 'off';
                  },
                }),
                invoke: {
                  src: 'repeat',
                },
                on: { TOGGLE_REPEAT: 'track' },
              },
              track: {
                entry: assign<PlayerContext, any>({
                  repeatMode: () => {
                    return 'track';
                  },
                }),
                invoke: {
                  src: 'repeat',
                },
                on: { TOGGLE_REPEAT: 'context' },
              },
              context: {
                entry: assign<PlayerContext, any>({
                  repeatMode: () => {
                    return 'context';
                  },
                }),
                invoke: {
                  src: 'repeat',
                },
                on: { TOGGLE_REPEAT: 'off' },
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      isShuffleEnabled: (context) => {
        return context.isShuffle;
      },
    },
    services: {
      repeat: async (context) => {
        try {
          // we can handle this better with states
          if (token && context.playerState) {
            await fetch(
              `https://api.spotify.com/v1/me/player/repeat?state=${context.repeatMode}`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        } catch (e) {
          console.error(e);
        }
      },
      shuffle: async (context) => {
        // we can handle this better with states
        if (token && context.playerState) {
          await fetch(
            `https://api.spotify.com/v1/me/player/shuffle?state=${context.isShuffle}`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      },
    },
  }
);

export default playerMachine;
