import { createMachine } from 'xstate';
interface WindowSchema {
  states: {
    minimized: {};
    maximized: {};
    floating: {};
  };
}
type WindowEvent =
  | { type: 'FLOAT' }
  | { type: 'MINIMIZE' }
  | { type: 'MAXIMIZE' };

const windowMachine = createMachine<any, WindowSchema, WindowEvent>({
  id: 'window',
  initial: 'floating',
  states: {
    minimized: { on: { FLOAT: 'floating' } },
    maximized: { on: { MINIMIZE: 'minimized', FLOAT: 'floating' } },
    floating: { on: { MINIMIZE: 'minimized', MAXIMIZE: 'maximized' } },
  },
});

export default windowMachine;
