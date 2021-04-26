import { FC, useEffect, useRef, useState } from 'react';
import useMutationObserver from '@rooks/use-mutation-observer';
import styled from 'styled-components/macro';
import Neovim from '../components/Neovim';
import Prompt from '../components/Prompt';
import usePromptState from '../hooks/usePromptState';
import useIsFocused from '../hooks/useIsFocused';
import useLocalStorage from '../hooks/useLocalStorage';
import { formatDate } from '../utils';

export type View = 'terminal' | 'nvim';

const Terminal: FC = () => {
  const prompState = usePromptState();
  const [view, setView] = useState<View>('terminal');
  const [fileContent, setFileContent] = useState('');
  const [lastLogin, setLastLogin] = useLocalStorage(
    'lastLogin',
    formatDate(new Date())
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      setLastLogin(formatDate(new Date()));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callback = () => {
    if (consoleRef.current) {
      const scrollHeight = consoleRef.current.scrollHeight;
      consoleRef.current.scrollTo(0, scrollHeight);
    }
  };

  const { isFocused } = useIsFocused(ref);

  useMutationObserver(consoleRef, callback);

  return (
    <Wrapper ref={ref}>
      <TopBar className="action-bar" />
      {view === 'terminal' && (
        <Console ref={consoleRef}>
          <div
            style={{
              height: '100%',
              width: '100%',
              padding: '3px',
            }}
          >
            <LastLogin>{`Last login: ${lastLogin} on ttys001`}</LastLogin>
            <Prompt
              isTerminalFocused={isFocused}
              setView={setView}
              setFileContent={setFileContent}
              promptState={prompState}
            ></Prompt>
          </div>
        </Console>
      )}
      {view === 'nvim' && (
        <Console>
          <Neovim
            fileContent={fileContent}
            setView={setView}
            isTerminalFocused={true}
          />
        </Console>
      )}
    </Wrapper>
  );
};

const TopBar = styled.div`
  background: rgb(56, 56, 56);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 30px;
  padding: 7px;
`;
const LastLogin = styled.div`
  color: white;
  margin-bottom: 7px;
`;
const Console = styled.div`
  font-family: 'Roboto Mono', monospace;
  height: calc(100% - 30px);
  width: 100%;
  background: #151516;
  flex: 1;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: auto;
`;
const Wrapper = styled.div`
  transition: transform 0.7s, opacity 0.4s;
  transform-origin: top left;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: rgb(0 0 0 / 30%) 0px 15px 20px, rgb(0 0 0 / 32%) 0px 18px 20px 5px;
`;

export default Terminal;
