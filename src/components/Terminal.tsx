import React, { FC, useRef } from 'react';
import useMutationObserver from '@rooks/use-mutation-observer';
import styled from 'styled-components/macro';
import Window from '../components/Window';
import Prompt from '../components/Prompt';
import ActionBar from '../components/ActionBar';
import useIsFocused from '../hooks/useIsFocused';
import { RectResult } from '../hooks/useRect';

const Terminal: FC<{
  minimizedTargetRect: RectResult;
  isTerminalMinimized: boolean;
  setIsTerminalMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ minimizedTargetRect, isTerminalMinimized, setIsTerminalMinimized }) => {
  const wrapperRef = useRef(null);
  const terminalWrapperRef = useRef<HTMLDivElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);

  const callback = () => {
    if (consoleRef.current) {
      const scrollHeight = consoleRef.current.scrollHeight;
      consoleRef.current.scrollTo(0, scrollHeight);
    }
  };
  const isTerminalFocused = useIsFocused(terminalWrapperRef);

  useMutationObserver(consoleRef, callback);
  const isWindowFocused = useIsFocused(wrapperRef);

  const handleMinimizeClick = () => {
    setIsTerminalMinimized(true);
  };

  return (
    <Window
      height={400}
      width={800}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isTerminalMinimized}
      isWindowFocused={isWindowFocused}
    >
      <Wrapper isWindowMinimized={isTerminalMinimized} ref={wrapperRef}>
        <ActionBar handleMinimizeClick={handleMinimizeClick} />
        <Console ref={consoleRef}>
          <LastLogin>Last login: Sun Mar 14 23:14:25 on ttys001</LastLogin>
          <Prompt isTerminalFocused={isTerminalFocused}></Prompt>
        </Console>
      </Wrapper>
    </Window>
  );
};

const LastLogin = styled.div`
  color: white;
  margin-bottom: 7px;
`;
const Console = styled.div`
  font-family: 'Roboto Mono', monospace;
  height: calc(100% - 22px);
  width: 100%;
  padding: 3px;
  background: #151516;
  flex: 1;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: scroll;
`;
const Wrapper = styled.div<{
  isWindowMinimized: boolean;
}>`
  ${({ isWindowMinimized }) =>
    isWindowMinimized
      ? `transform: scale(0.2); opacity: 0;`
      : `transform: scale(1); opacity: 1;`}
  transition: transform .7s, opacity .4s;
  transform-origin: top left;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export default Terminal;
