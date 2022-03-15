import { createMachine } from 'xstate';

export const neovimMachine = createMachine(
  {
    id: 'neovim',
    initial: 'loading',
    states: {
      loading: {
        after: {
          START_NEOVIM: { target: 'neovim' },
        },
      },
      neovim: {},
    },
  },
  {
    delays: {
      START_NEOVIM: 2000,
    },
  }
);
