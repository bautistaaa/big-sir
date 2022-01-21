import { assign, createMachine } from 'xstate';
import { FeedData } from './useFeedData';

export interface HomeMachineContext {
  data?: FeedData;
}

export type HomeMachineEvent = {
  type: 'RECEIVED_DATA';
  data: FeedData;
};

const homeMachine = createMachine<HomeMachineContext, HomeMachineEvent>({
  id: 'home',
  initial: 'loading',
  context: {
    data: undefined,
  },
  states: {
    loading: {
      on: {
        RECEIVED_DATA: {
          target: 'success',
          actions: assign({
            data: (_, event) => event.data,
          }),
        },
      },
    },
    success: { type: 'final' },
    error: {},
  },
});

export default homeMachine;
