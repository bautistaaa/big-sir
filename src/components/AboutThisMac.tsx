import { forwardRef, ForwardRefRenderFunction, useEffect, useRef } from 'react';
import useMutationObserver from '@rooks/use-mutation-observer';
import styled from 'styled-components/macro';
import Window from '../components/Window';
import BaseActionBar from '../components/ActionBar';
import { RectResult } from '../hooks/useRect';
import { useAppContext } from '../AppContext';
import useIsFocused from '../hooks/useIsFocused';

const AboutThisMac: ForwardRefRenderFunction<
  HTMLDivElement,
  {
    minimizedTargetRect: RectResult;
  }
> = ({ minimizedTargetRect }, ref) => {
  const { state, dispatch } = useAppContext();
  const aboutThisMacState = state.activeWindows.find(
    (aw) => aw.name === 'aboutThisMac'
  );
  const isMinimized = !!state.minimizedWindows.find(
    (mw) => mw.name === 'aboutThisMac'
  );
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const { isFocused: isAboutThisMacFocused } = useIsFocused(ref as any);

  useEffect(() => {
    if (isAboutThisMacFocused) {
      dispatch({
        type: 'focusWindow',
        payload: { name: 'aboutThisMac', ref: ref as any },
      });
    }
  }, [isAboutThisMacFocused]);

  const callback = () => {
    if (consoleRef.current) {
      const scrollHeight = consoleRef.current.scrollHeight;
      consoleRef.current.scrollTo(0, scrollHeight);
    }
  };

  useMutationObserver(consoleRef, callback);

  const handleMinimizeClick = () => {
    dispatch({ type: 'minimizedWindow', payload: { name: 'aboutThisMac' } });
  };
  const handleCloseClick = () => {
    dispatch({ type: 'removeWindow', payload: { name: 'aboutThisMac' } });
  };
  const handleMaximizeClick = () => {};

  return (
    <Window
      height={320}
      width={530}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isMinimized}
      zIndex={aboutThisMacState?.zIndex}
      resizeable={false}
    >
      <Wrapper isWindowMinimized={isMinimized} ref={ref}>
        <ActionBar
          handleMinimizeClick={handleMinimizeClick}
          handleCloseClick={handleCloseClick}
          handleMaximizeClick={handleMaximizeClick}
        />
        <Content>
          <Circle>
            <img src="about.jpg" />
          </Circle>
          <Text>
            <Name>
              <Strong>macOS</Strong> Big Sir
            </Name>
            <Version>Version 420.69</Version>
            <P>MacBooks Are Awful (32-inch, 2087)</P>
            <P>Processor A very good one</P>
            <P>Memory A good amount of it</P>
          </Text>
        </Content>
      </Wrapper>
    </Window>
  );
};

const Strong = styled.span`
  font-weight: 500;
`;
const Name = styled.div`
  font-size: 28px;
  line-height: 32px;
  font-weight: 200;
`;
const Version = styled.div`
  font-size: 12px;
  margin-bottom: 20px;
`;
const P = styled.div`
  font-size: 12px;
  margin-bottom: 7px;
`;
const ActionBar = styled(BaseActionBar)`
  height: 40px;
  padding-left: 15px;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgb(27 27 29 / 70%);
  backdrop-filter: blur(72px);
  height: calc(100% - 40px);
  width: 100%;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: scroll;
`;
const Circle = styled.div`
  height: 150px;
  width: 150px;
  border-radius: 50%;
  border: 7px solid white;
  margin-right: 60px;
  overflow: hidden;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
const Text = styled.div`
  height: 100%;
  padding-top: 46px;
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

export default forwardRef(AboutThisMac);
