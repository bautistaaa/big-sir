import { ThemeProvider } from 'styled-components/macro';
import { FC } from 'react';
import Desktop from './Desktop';
import GlobalStyling from './shared/GlobalStyling';
import { useAppContext } from './AppContext';
import { darkTheme, lightTheme } from './shared/theme';
import { useActor } from '@xstate/react';

const App: FC = () => {
  const service = useAppContext();
  const [state] = useActor(service);
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
