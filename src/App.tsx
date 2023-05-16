import { ThemeProvider } from 'styled-components';
import { FC } from 'react';
import Desktop from './Desktop';
import GlobalStyling from './shared/GlobalStyling';
import { useAppContext } from './AppContext';
import { darkTheme, lightTheme } from './shared/theme';
import { useActor } from '@xstate/react';

const App: FC = () => {
  const service = useAppContext();
  const [current] = useActor(service);
  return (
    <ThemeProvider
      theme={current.context.mode === 'light' ? lightTheme : darkTheme}
    >
      <GlobalStyling />
      <Desktop />
    </ThemeProvider>
  );
};

export default App;
