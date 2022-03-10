import { ThemeProvider } from 'styled-components/macro';
import { FC } from 'react';
import Desktop from './Desktop';
import GlobalStyling from './shared/GlobalStyling';
import { useAppContext } from './AppContext';
import { darkTheme, lightTheme } from './shared/theme';

const App: FC = () => {
  const { current } = useAppContext();
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
