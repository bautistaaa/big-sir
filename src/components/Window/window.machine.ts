import { createMachine } from 'xstate';

export type WindowEvent =
  | { type: 'FLOAT' }
  | { type: 'MINIMIZE' }
  | { type: 'MAXIMIZE' };

const windowMachine = createMachine<any, WindowEvent>({
  id: 'window',
  initial: 'floating',
  states: {
    minimized: { on: { FLOAT: 'floating' } },
    maximized: { on: { MINIMIZE: 'minimized', FLOAT: 'floating' } },
    floating: { on: { MINIMIZE: 'minimized', MAXIMIZE: 'maximized' } },
  },
});

export default windowMachine;
