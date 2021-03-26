import { FC, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Terminal from './components/Terminal';
import Finder from './components/Finder';
import styled from 'styled-components/macro';
import useRect from './hooks/useRect';

const App: FC = () => {
  const minimizedTerminalRef = useRef(null);
  const minimizedTerminalRect = useRect(minimizedTerminalRef, []);
  const [isTerminalMinimized, setIsTerminalMinized] = useState(false);

  const minimizedFinderRef = useRef(null);
  const [isFinderMinimized, setIsFinderMinimized] = useState(false);
  const minimizedFinderRect = useRect(minimizedFinderRef, []);

  return (
    <Wrapper>
      <TopBar />
      <Terminal
        minimizedTargetRect={minimizedTerminalRect}
        isTerminalMinimized={isTerminalMinimized}
        setIsTerminalMinimized={setIsTerminalMinized}
      />
      <Finder
        minimizedTargetRect={minimizedFinderRect}
        isFinderMinimized={isFinderMinimized}
        setIsFinderMinimized={setIsFinderMinimized}
      />
      <Dock
        minimizedTerminalRef={minimizedTerminalRef}
        isTerminalMinimized={isTerminalMinimized}
        setIsTerminalMinimized={setIsTerminalMinized}
        minimizedFinderRef={minimizedFinderRef}
        isFinderMinimized={isFinderMinimized}
        setIsFinderMinimized={setIsFinderMinimized}
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
