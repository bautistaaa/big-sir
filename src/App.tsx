import { FC, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Dock from './components/Dock';
import Terminal from './components/Terminal';
import styled from 'styled-components/macro';
import useRect from './hooks/useRect';

const App: FC = () => {
  const [isTerminalMinimized, setIsTerminalMinized] = useState(false);
  const terminalRef = useRef(null);
  const minimizedTerminalRef = useRef(null);
  const [test, setTest] = useState(0);
  const [deltaX, setDeltaX] = useState(0);

  const minimizedRect = useRect(minimizedTerminalRef, []);
  const terminalRect = useRect(terminalRef, [test]);

  useEffect(() => {
    const x = minimizedRect.left - terminalRect.left;
    setDeltaX(x)
    console.log(window.innerWidth)
  }, [minimizedRect, terminalRect]);

  return (
    <Wrapper>
      <Overlay />
      <Draggable
        onStop={() => setTest((x) => x + 1)}
        position={isTerminalMinimized ? { x: deltaX, y: 1000 } : undefined}
      >
        <TerminalWrapper
          ref={terminalRef}
          isTerminalMinimized={isTerminalMinimized}
        >
          <Terminal setIsTerminalMinimized={setIsTerminalMinized} />
        </TerminalWrapper>
      </Draggable>
      <DockWrapper>
        <Dock
          minimizedTerminalRef={minimizedTerminalRef}
          isTerminalMinimized={isTerminalMinimized}
          setIsTerminalMinimized={setIsTerminalMinized}
        />
      </DockWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: url('./sasuke.png') no-repeat center top fixed;
  background-size: cover;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
`;
const TerminalWrapper = styled.div<{
  isTerminalMinimized: boolean;
}>`
  ${({ isTerminalMinimized }) =>
    isTerminalMinimized
      ? `
        pointer-events: none;
        opacity: 0;
        transform: scale(0.1);
        transition: transform .7s, opacity 0.5s;
      `
      : `opacity: 1;`
  }
  position: absolute;
  bottom: 40%;
  left: 30%;
`;
const DockWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
`;
export default App;
