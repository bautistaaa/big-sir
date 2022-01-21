import { assign, createMachine } from 'xstate';

interface PlaylistItemContext {
  isPlaying: boolean;
  isHovered: boolean;
  isSelected: boolean;
}

const playlistItemMachine = (isPlaying: boolean) =>
  createMachine<PlaylistItemContext>(
    {
      id: 'playlistItem',
      initial: 'idle',
      context: {
        isPlaying,
        isHovered: false,
        isSelected: false,
      },
      states: {
        idle: {
          type: 'parallel',
          states: {
            status: {
              initial: 'unknown',
              states: {
                unknown: {
                  always: [
                    { target: 'playing', cond: 'isTrackPlaying' },
                    { target: 'paused' },
                  ],
                },
                playing: {
                  on: {
                    TOGGLE: 'paused',
                  },
                  entry: assign<PlaylistItemContext, any>({
                    isPlaying: true,
                  }),
                },
                paused: {
                  on: {
                    TOGGLE: 'playing',
                  },
                  entry: assign<PlaylistItemContext, any>({
                    isPlaying: false,
                  }),
                },
              },
            },
            hovered: {
              initial: 'disabled',
              states: {
                disabled: {
                  on: { TOGGLE_HOVER: 'enabled' },
                },
                enabled: {
                  on: { TOGGLE_HOVER: 'disabled' },
                },
              },
            },
            selected: {
              initial: 'disabled',
              states: {
                disabled: {
                  on: { TOGGLE_SELECTED: 'enabled' },
                },
                enabled: {
                  on: { TOGGLE_SELECTED: 'disabled' },
                },
              },
            },
          },
        },
      },
    },
    {
      guards: {
        isTrackPlaying: (context) => {
          return context.isPlaying;
        },
      },
    }
  );

export default playlistItemMachine;
