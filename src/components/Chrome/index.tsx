import { forwardRef, ForwardRefRenderFunction } from 'react';
import styled from 'styled-components';
import ActionBar from '../../components/ActionBar';
import Window from '../../components/Window';
// import useIsFocused from '../../hooks/useIsFocused';
import { RectResult } from '../../hooks/useRect';
import { useAppContext } from '../../AppContext';

const Chrome: ForwardRefRenderFunction<
  HTMLDivElement,
  {
    minimizedTargetRect: RectResult;
  }
> = ({ minimizedTargetRect }, ref) => {
  const { state, dispatch } = useAppContext();
  // const { isFocused: isTerminalFocused, setIsFocused } = useIsFocused(
  //   ref as any
  // );
  const chromeState = state.activeWindows.find((aw) => aw.name === 'chrome');
  const isMinimized = !!state.minimizedWindows.find(
    (mw) => mw.name === 'chrome'
  );

  const handleMaximizeClick = () => {};
  const handleMinimizeClick = () => {
    dispatch({ type: 'minimizedWindow', payload: { name: 'chrome' } });
  };
  const handleCloseClick = () => {
    dispatch({ type: 'removeWindow', payload: { name: 'chrome' } });
  };

  return (
    <Window
      height={500}
      width={600}
      minimizedTargetRect={minimizedTargetRect}
      isWindowMinimized={isMinimized}
      zIndex={chromeState?.zIndex}
    >
      <Wrapper>
        <TopBar>
          <ActionBar
            handleMaximizeClick={handleMaximizeClick}
            handleMinimizeClick={handleMinimizeClick}
            handleCloseClick={handleCloseClick}
          />
          <UtilBar></UtilBar>
          <BrowserBar></BrowserBar>
        </TopBar>
        <Content>asdasdasdasdasd</Content>
      </Wrapper>
    </Window>
  );
};

const Wrapper = styled.div``;
const TopBar = styled.div``;
const UtilBar = styled.div``;
const BrowserBar = styled.div``;
const Content = styled.div`
  height: calc(100% - 22px);
  width: 100%;
  background: #151516;
  flex: 1;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: scroll;
`;

export default forwardRef(Chrome);
