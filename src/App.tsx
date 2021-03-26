import { FC, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Terminal from './components/Terminal';
import Finder from './components/Finder';
import styled from 'styled-components/macro';
import useRect from './hooks/useRect';
import { useAppContext } from './AppContext';

const App: FC = () => {
  const { state } = useAppContext();
  const isTerminalActive = state.activeWindows.some(
    (aw) => aw.name === 'terminal'
  );
  const isFinderActive = state.activeWindows.some((aw) => aw.name === 'finder');

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const finderRef = useRef<HTMLDivElement | null>(null);

  const minimizedTargetRef = useRef(null);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);

  const [isTerminalMinimized, setIsTerminalMinized] = useState(false);

  const [isFinderMinimized, setIsFinderMinimized] = useState(false);

  return (
    <Wrapper>
      <TopBar />
      {isTerminalActive && (
        <Terminal
          ref={terminalRef}
          minimizedTargetRect={minimizedTargetRect}
          isTerminalMinimized={isTerminalMinimized}
          setIsTerminalMinimized={setIsTerminalMinized}
        />
      )}

      {isFinderActive && (
        <Finder
          ref={finderRef}
          minimizedTargetRect={minimizedTargetRect}
          isFinderMinimized={isFinderMinimized}
          setIsFinderMinimized={setIsFinderMinimized}
        />
      )}

      <Dock
        terminalRef={terminalRef}
        finderRef={finderRef}
        isTerminalMinimized={isTerminalMinimized}
        setIsTerminalMinimized={setIsTerminalMinized}
        isFinderMinimized={isFinderMinimized}
        setIsFinderMinimized={setIsFinderMinimized}
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
