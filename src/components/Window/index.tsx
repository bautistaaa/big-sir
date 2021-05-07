import { FC, useEffect, useRef, memo, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useMachine } from '@xstate/react';
import windowMachine from './window.machine';
import StopLights from '../StopLights';
import { useAppContext } from '../../AppContext';
import configs, { AppType } from '../../shared/configs';
import Chrome from '../Chrome';
import Finder from '../Finder';
import Terminal from '../Terminal';
import AboutThisDeveloper from '../AboutThisDeveloper';
import AboutThisMac from '../AboutThisMac';
import { RectResult } from '../../hooks/useRect';
import useResizeWindow from '../../hooks/useResizeWindow';
import useIsFocused from '../../hooks/useIsFocused';
import styled from 'styled-components/macro';

export type WindowSize = {
  width: string | number;
  height: string | number;
};

export type WindowPosition = {
  x: number;
  y: number;
};

interface WindowProps {
  name: AppType;
  minimizedTargetRect: RectResult;
}
const Window: FC<WindowProps> = memo(({ name, minimizedTargetRect }) => {
  const x: { [K in AppType]: React.ComponentType<any> } = {
    aboutThisDeveloper: AboutThisDeveloper,
    aboutThisMac: AboutThisMac,
    chrome: Chrome,
    finder: Finder,
    terminal: Terminal,
  };
  const Component = x[name];

  const ref = useRef<HTMLDivElement | null>(null);
  const { current: currentParent, send: sendParent } = useAppContext();
  const [current, send] = useMachine(windowMachine);
  const { isFocused } = useIsFocused(ref);

  const isMinimized = !!currentParent.context.minimizedWindows.find(
    (mw) => mw.name === name
  );
  const windowState = currentParent.context.activeWindows.find(
    (aw) => aw.name === name
  );
  const {
    width: windowWidth,
    height: windowHeight,
    resizeable,
    minHeight,
    minWidth,
  } = configs[name];
  const mounted = useRef(false);
  const windowRef = useRef<Rnd>();
  useResizeWindow(
    current,
    { height: windowHeight, width: windowWidth },
    windowRef,
    minimizedTargetRect
  );

  useEffect(() => {
    if (mounted.current) {
      if (!isMinimized) {
        send('FLOAT');
      }
    }
  }, [isMinimized, send]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      sendParent({
        type: 'FOCUS_WINDOW',
        payload: { name },
      });
    }
  }, [isFocused, sendParent, name]);

  const focusWindow = () => {
    sendParent({
      type: 'FOCUS_WINDOW',
      payload: { name },
    });
  };
  const handleMinimizeClick = useCallback(
    (e: Event) => {
      e.stopPropagation();
      sendParent({ type: 'MINIMIZE_WINDOW', payload: { name } });
      send('MINIMIZE');
    },
    [send, sendParent, name]
  );
  const handleCloseClick = useCallback(
    (e: Event) => {
      e.stopPropagation();
      sendParent({ type: 'REMOVE_WINDOW', payload: { name } });
    },
    [sendParent, name]
  );
  const handleMaximizeClick = useCallback(
    (e: Event) => {
      e.stopPropagation();
      if (!resizeable) return;
      if (current.value === 'maximized') {
        send('FLOAT');
      } else {
        send('MAXIMIZE');
      }
    },
    [current.value, send, resizeable]
  );

  return (
    <Rnd
      ref={(c) => {
        if (c) windowRef.current = c;
      }}
      style={{
        cursor: 'auto !important',
        zIndex: windowState?.zIndex ?? 0,
      }}
      bounds=".bounds"
      dragHandleClassName="action-bar"
      minHeight={minHeight ?? 300}
      minWidth={minWidth ?? 300}
      default={{
        x: Math.round(window.innerWidth / 2 - windowWidth / 2),
        y: Math.round(window.innerHeight / 2 - windowHeight / 2),
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
      }}
      enableResizing={resizeable}
      onDragStop={(_, d) => {
        if (windowRef.current?.resizableElement.current) {
          windowRef.current.resizableElement.current.style.transform = `translate(${Math.round(
            d.x
          )}px, ${Math.round(d.y)}px)`;
        }
      }}
      onDragStart={focusWindow}
      onResizeStart={focusWindow}
    >
      <Wrapper active={windowState?.focused ?? false}>
        <Border>
          <Container ref={ref}>
            <div onClick={focusWindow}>
              <StopLights
                variant={name}
                handleMinimizeClick={handleMinimizeClick}
                handleCloseClick={handleCloseClick}
                handleMaximizeClick={handleMaximizeClick}
              />
            </div>
            <Component key={name} />
          </Container>
        </Border>
      </Wrapper>
    </Rnd>
  );
});

const Wrapper = styled.div<{ active: boolean }>`
  height: 100%;
  width: 100%;
  box-shadow: ${({ active }) =>
    active
      ? 'rgb(0 0 0 / 30%) 0px 15px 20px, rgb(0 0 0 / 32%) 0px 18px 20px 5px'
      : '0 3px 6px rgba(0,0,0,0.16), 0 11px 13px rgba(0,0,0,0.23)'};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;
const Container = styled.div`
  height: 100%;
  margin: 1px 1px 1px 1px;
  border-radius: inherit;
`;
const Border = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  box-shadow: inset 0 0 0 0.9px hsla(240, 24%, 100%, 0.3),
    0 0 0 1px hsla(240, 3%, 11%, 0.5);
`;

export default Window;
