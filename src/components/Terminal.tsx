import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useRef,
} from 'react';
import useMutationObserver from '@rooks/use-mutation-observer';
import styled from 'styled-components/macro';
import Window from '../components/Window';
import Prompt from '../components/Prompt';
import ActionBar from '../components/ActionBar';
import { RectResult } from '../hooks/useRect';
import { useAppContext } from '../AppContext';
import useIsFocused from '../hooks/useIsFocused';

const Terminal: ForwardRefRenderFunction<
  HTMLDivElement,
  {
    minimizedTargetRect: RectResult;
    isTerminalMinimized: boolean;
    setIsTerminalMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = (
  { minimizedTargetRect, isTerminalMinimized, setIsTerminalMinimized },
  ref
) => {
  const { state, dispatch } = useAppContext();
  const terminalState = state.activeWindows.find(
    (aw) => aw.name === 'terminal'
  );
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const isTerminalFocused = useIsFocused(ref as any);

  useEffect(() => {
    if (isTerminalFocused) {
      dispatch({
        type: 'focusWindow',
        payload: { name: 'terminal', ref: ref as any },
      });
    }
  }, [isTerminalFocused]);

  const callback = () => {
    if (consoleRef.current) {
      const scrollHeight = consoleRef.current.scrollHeight;
      consoleRef.current.scrollTo(0, scrollHeight);
    }
  };
  useMutationObserver(consoleRef, callback);

  const handleMinimizeClick = () => {
    setIsTerminalMinimized(true);
  };
  const handleCloseClick = () => {
    dispatch({ type: 'removeWindow', payload: { name: 'terminal' } });
  };

  return (
    <Window
      height={400}
      width={800}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isTerminalMinimized}
      zIndex={terminalState?.zIndex}
    >
      <Wrapper isWindowMinimized={isTerminalMinimized} ref={ref}>
        <ActionBar
          handleMinimizeClick={handleMinimizeClick}
          handleCloseClick={handleCloseClick}
        />
        <Console ref={consoleRef}>
          <LastLogin>Last login: Sun Mar 14 23:14:25 on ttys001</LastLogin>
          <Prompt></Prompt>
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
`;

export default forwardRef(Terminal);
