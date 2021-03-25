import React, { FC, useRef } from 'react';
import useMutationObserver from '@rooks/use-mutation-observer';
import styled from 'styled-components/macro';
import Window from '../components/Window';
import Prompt from '../components/Prompt';
import useIsFocused from '../hooks/useIsFocused';
import { RectResult } from '../hooks/useRect';

const Terminal: FC<{
  minimizedTargetRect: RectResult;
  isTerminalMinimized: boolean;
  setIsTerminalMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ minimizedTargetRect, isTerminalMinimized, setIsTerminalMinimized }) => {
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

  return (
    <Window
      height={400}
      width={800}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isTerminalMinimized}
      setIsWindowMinimized={setIsTerminalMinimized}
    >
      <Console ref={consoleRef}>
        <LastLogin>Last login: Sun Mar 14 23:14:25 on ttys001</LastLogin>
        <Prompt isTerminalFocused={isTerminalFocused}></Prompt>
      </Console>
    </Window>
  );
};

const LastLogin = styled.div`
  color: white;
  margin-bottom: 7px;
`;
const Console = styled.div`
  height: calc(100% - 22px);
  width: 100%;
  padding: 3px;
  background: #151516;
  flex: 1;
  overflow: scroll;
`;

export default Terminal;
