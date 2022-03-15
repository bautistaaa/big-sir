import { useActor } from '@xstate/react';
// import { inspect } from '@xstate/inspect';
import { ThemeProvider } from 'styled-components/macro';
import Desktop from './Desktop';
import GlobalStyling from './shared/GlobalStyling';
import { useAppContext } from './AppContext';
import { darkTheme, lightTheme } from './shared/theme';

const App = () => {
  const service = useAppContext();
  const [state] = useActor(service);

  // inspect();

  return (
    <ThemeProvider
      theme={state.context.mode === 'light' ? lightTheme : darkTheme}
    >
      <GlobalStyling />
      <Desktop />
    </ThemeProvider>
  );
};

export default App;
