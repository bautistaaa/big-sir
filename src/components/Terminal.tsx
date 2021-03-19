import React, { FC, useRef } from 'react';
import useMutationObserver from '@rooks/use-mutation-observer';
import styled from 'styled-components/macro';
import Prompt from '../components/Prompt';
import useIsFocused from '../hooks/useIsFocused';

const RED = 'rgb(255 91 82)';
const YELLOW = 'rgb(230 192 41)';
const GREEN = '#53c22c';

const Terminal: FC<{
  setIsTerminalMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsTerminalMinimized }) => {
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
    <Wrapper ref={terminalWrapperRef}>
      <ActionBar>
        <CloseButton />
        <MinimizeButton onClick={() => setIsTerminalMinimized(true)} />
        <FullScreenButton />
      </ActionBar>
      <Console ref={consoleRef}>
        <LastLogin>Last login: Sun Mar 14 23:14:25 on ttys001</LastLogin>
        <Prompt isTerminalFocused={isTerminalFocused}></Prompt>
      </Console>
    </Wrapper>
  );
};

const LastLogin = styled.div`
  color: white;
  margin-bottom: 7px;
`;
const Wrapper = styled.div`
  font-family: 'Roboto Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 400px;
  width: 700px;
`;
const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  height: 22px;
  padding: 7px;
  background: #3a3a3b;
`;
const Console = styled.div`
  padding: 3px;
  background: #151516;
  flex: 1;
  overflow: scroll;
`;
const BaseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  & + & {
    margin-left: 5px;
  }
`;
const CloseButton = styled(BaseButton)`
  background: ${RED};
`;
const MinimizeButton = styled(BaseButton)`
  background: ${YELLOW};
`;
const FullScreenButton = styled(BaseButton)`
  background: ${GREEN};
`;

export default Terminal;