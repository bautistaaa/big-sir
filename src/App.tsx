import { FC, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Dock from './components/Dock';
import Terminal from './components/Terminal';
import styled from 'styled-components/macro';
import useRect from './hooks/useRect';
type DraggableData = {
  node: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
};

const App: FC = () => {
  const [isTerminalMinimized, setIsTerminalMinized] = useState(false);
  const terminalRef = useRef(null);
  const minimizedTerminalRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const minimizedRect = useRect(minimizedTerminalRef, []);
  const terminalRect = useRect(terminalRef, [refresh]);
  const [deltas, setDeltas] = useState<DraggableData>();
  const [addTransition, setAddTransition] = useState(false);
  const [position, setPosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);

  useEffect(() => {
    const x = minimizedRect.left - terminalRect.left;
    setDeltaX(x);
  }, [minimizedRect, terminalRect]);

  useEffect(() => {
    if (!isTerminalMinimized) {
      setAddTransition(true);
      const to = setTimeout(() => {
        setAddTransition(false);
      }, 700);

      return () => {
        clearTimeout(to);
      };
    }
  }, [isTerminalMinimized]);

  useEffect(() => {
    if (isTerminalMinimized) {
      setPosition({
        x: deltaX,
        y: 1000,
      });
    } else {
      if (deltas) {
        setPosition({ x: deltas!.lastX, y: deltas!.lastY });
      } else {
        setPosition(undefined);
      }
    }
  }, [isTerminalMinimized, deltas]);

  const handleOnStop = (_: any, d: DraggableData) => {
    setDeltas(d);
    setRefresh((x) => x + 1);
  };

  return (
    <Wrapper>
      <Overlay />
      <Draggable onStop={handleOnStop} position={position}>
        <TerminalWrapper
          ref={terminalRef}
          isTerminalMinimized={isTerminalMinimized}
          addTransition={addTransition}
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
  addTransition: boolean;
}>`
  ${({ isTerminalMinimized, addTransition }) =>
    isTerminalMinimized
      ? `
        pointer-events: none;
        opacity: 0;
        transform: scale(0.1);
        transition: transform .7s, opacity 0.5s;
      `
      : `
        ${addTransition ? 'transition: transform .7s, opacity 0.5s;' : ''}
        opacity: 1;
        `}
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
