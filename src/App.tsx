import { FC, useRef } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Terminal from './components/Terminal';
import Finder from './components/Finder';
import AboutThisMac from './components/AboutThisMac';
import styled from 'styled-components/macro';
import useRect from './hooks/useRect';
import { useAppContext } from './AppContext';

const App: FC = () => {
  const { state } = useAppContext();
  const isTerminalActive = state.activeWindows.some(
    (aw) => aw.name === 'terminal'
  );
  const isFinderActive = state.activeWindows.some((aw) => aw.name === 'finder');
  const isAboutThisMacActive = state.activeWindows.some(
    (aw) => aw.name === 'aboutThisMac'
  );

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const finderRef = useRef<HTMLDivElement | null>(null);
  const aboutThisMacRef = useRef<HTMLDivElement | null>(null);

  const minimizedTargetRef = useRef(null);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);

  return (
    <Wrapper>
      <TopBar ref={aboutThisMacRef} />
      {isTerminalActive && (
        <Terminal ref={terminalRef} minimizedTargetRect={minimizedTargetRect} />
      )}

      {isFinderActive && (
        <Finder ref={finderRef} minimizedTargetRect={minimizedTargetRect} />
      )}

      {isAboutThisMacActive && (
        <AboutThisMac
          ref={aboutThisMacRef}
          minimizedTargetRect={minimizedTargetRect}
        />
      )}

      <Dock
        terminalRef={terminalRef}
        finderRef={finderRef}
        minimizedTargetRef={minimizedTargetRef}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  background: url('./bg-3.jpg') no-repeat center top fixed;
  background-size: cover;
`;
export default App;
