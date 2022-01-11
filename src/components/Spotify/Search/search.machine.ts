import { Machine, assign, State } from 'xstate';

interface SearchMachineStates {
  states: {
    checkTerm: {};
    idle: {};
    searching: {};
    generic: {};
  };
}

export type SearchSelectorState = State<
  SearchMachineContext,
  SearchMachineEvents,
  any,
  any
>;

export type SearchMachineEvents =
  | { type: 'GENERIC_ERROR' }
  | { type: 'GENERIC_SUCCESS'; data: SpotifyApi.MultipleCategoriesResponse }
  | { type: 'SEARCH_ERROR' }
  | { type: 'SEARCH_SUCCESS'; data: SpotifyApi.SearchResponse }
  | { type: 'TERM_CHANGED'; term: string };

export interface SearchMachineContext {
  results: SpotifyApi.SearchResponse;
  genericResults?: SpotifyApi.MultipleCategoriesResponse;
  message: string;
  term: string;
}

const fetchMachine = Machine<
  SearchMachineContext,
  SearchMachineStates,
  SearchMachineEvents
>(
  {
    id: 'search',
    initial: 'checkTerm',
    context: {
      results: {},
      message: '',
      term: '',
    },
    states: {
      checkTerm: {
        always: [
          {
            cond: 'thereIsSearchTerm',
            target: 'searching',
          },
          {
            target: 'generic',
          },
        ],
      },
      idle: {
        on: {
          TERM_CHANGED: {
            target: 'checkTerm',
            actions: assign({
              term: (_, event) => event.term,
            }),
          },
        },
      },
      searching: {
        on: {
          SEARCH_SUCCESS: {
            target: 'idle',
            actions: assign({
              results: (_, event) => event.data,
            }),
          },
          SEARCH_ERROR: {
            target: 'idle',
            actions: [() => console.error('frick')],
          },
        },
      },
      generic: {
        on: {
          GENERIC_SUCCESS: {
            target: 'idle',
            actions: assign({
              genericResults: (_, event) => event.data,
            }),
          },
          GENERIC_ERROR: {
            target: 'idle',
            actions: [() => console.error('frick')],
          },
        },
      },
    },
  },
  {
    guards: {
      thereIsSearchTerm: (context) => {
        return !!context.term;
      },
    },
    actions: {
      setGenericResults: assign((_, event: any) => ({
        results: event.results,
      })),
      setResults: assign((_, event: any) => ({
        results: event.results,
      })),
      setMessage: assign((_, event: any) => ({
        message: event.message,
      })),
    },
  }
);

export default fetchMachine;
