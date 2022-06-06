import { assign, createMachine } from 'xstate';

export interface Context {
  password: string;
}

export const loginMachine = createMachine<Context>({
  id: 'login',
  initial: 'idle',
  context: {
    password: '',
  },
  states: {
    idle: {
      on: {
        PASSWORD_UPDATE: {
          actions: assign({
            password: (_, event) => event.payload.password,
          }),
        },
        SUBMIT: [
          {
            target: 'valid',
            cond: (context: Context) => {
              return !!context.password;
            },
          },
          { target: 'invalid' },
        ],
      },
    },
    invalid: {
      after: {
        500: { target: 'idle' },
      },
    },
    valid: {
      // entry: [sendParent({ type: 'TOGGLE_AUTHENTICATION' })],
    },
  },
});
