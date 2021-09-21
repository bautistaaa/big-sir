import { useMachine } from '@xstate/react';
import { Interpreter } from 'xstate';
import { createContext, FC, useContext } from 'react';

import searchMachine, {
  SearchMachineContext,
  SearchMachineEvents,
} from './Search/search.machine';

type SpotifyContextValue = Interpreter<
  SearchMachineContext,
  any,
  SearchMachineEvents,
  {
    value: any;
    context: SearchMachineContext;
  }
>;

export const StickyBarContext = createContext<SpotifyContextValue>(
  {} as Interpreter<
    SearchMachineContext,
    any,
    SearchMachineEvents,
    {
      value: any;
      context: SearchMachineContext;
    }
  >
);

const useStickyBarContext = () => {
  const context = useContext(StickyBarContext);
  if (context === undefined) {
    throw new Error(
      'useStickyBarContext must be used within a StickyBarProvider'
    );
  }
  return context;
};

const StickyBarProvider: FC = ({ children }) => {
  const [, , service] = useMachine(searchMachine);

  return (
    <StickyBarContext.Provider value={service}>
      {children}
    </StickyBarContext.Provider>
  );
};

export { StickyBarProvider, useStickyBarContext };
