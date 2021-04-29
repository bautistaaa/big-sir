import { FC, useEffect, useRef, memo } from 'react';
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
import useMaximizeWindow from '../../hooks/useMaximizeWindow';
import extractPositionFromTransformStyle from '../../utils/extractTransformStyles';
import useIsFocused from '../../hooks/useIsFocused';

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

  const { state, dispatch } = useAppContext();

  const [current, send] = useMachine(windowMachine);

  const ref = useRef<HTMLDivElement | null>(null);
  const { isFocused } = useIsFocused(ref);

  const isMinimized = !!state.minimizedWindows.find((mw) => mw.name === name);
  const appState = state.activeWindows.find((aw) => aw.name === name);
  const { width: windowWidth, height: windowHeight, resizeable } = configs[
    name
  ];
  const mounted = useRef(false);
  const windowRef = useRef<Rnd>();
  const transitionClearanceRef = useRef<number>();
  const originalSizeRef = useRef<WindowSize>({
    height: windowHeight,
    width: windowWidth,
  });
  const originalPositionRef = useRef<WindowPosition>({
    x: window.innerWidth / 2 - windowWidth / 2,
    y: window.innerHeight / 2 - windowHeight / 2,
  });
  const maximizeApp = useMaximizeWindow(
    windowRef,
    { height: windowHeight, width: windowWidth },
    send
  );
  const focusWindow = () => {
    dispatch({
      type: 'focusWindow',
      payload: { name },
    });
  };

  useEffect(() => {
    if (mounted.current) {
      if (!isMinimized) {
        send('FLOAT');
      }
    }
  }, [isMinimized, send]);

  useEffect(() => {
    switch (current.value) {
      case 'floating':
        if (current.history?.matches('minimized')) {
          if (windowRef.current?.resizableElement.current) {
            windowRef.current.resizableElement.current.style.transition =
              'height .6s, width .6s, transform .6s, opacity .6s';
            windowRef.current.resizableElement.current.style.opacity = '1';
            window.setTimeout(() => {
              if (windowRef.current?.resizableElement.current) {
                windowRef.current.resizableElement.current.style.transition =
                  '';
              }
            }, 1000);
          }
          windowRef.current?.updatePosition({
            x: originalPositionRef.current.x,
            y: originalPositionRef.current.y,
          });
          windowRef.current?.updateSize(originalSizeRef.current);
          windowRef.current?.updatePosition(originalPositionRef.current);
        }
        break;
      case 'minimized':
        if (!current.history?.matches('minimized')) {
          if (!windowRef?.current?.resizableElement?.current) {
            return;
          }
          const {
            clientWidth: windowWidth,
            clientHeight: windowHeight,
          } = windowRef.current.resizableElement.current;
          const {
            x: windowLeft,
            y: windowTop,
          } = extractPositionFromTransformStyle(
            windowRef.current.resizableElement.current.style.transform
          );
          originalPositionRef.current = { x: windowLeft, y: windowTop };
          originalSizeRef.current = {
            width: windowWidth,
            height: windowHeight,
          };

          windowRef.current.resizableElement.current.style.transition =
            'height .6s, width .6s, transform .6s, opacity .5s';

          windowRef.current.resizableElement.current.style.opacity = '0';

          clearTimeout(transitionClearanceRef.current);

          transitionClearanceRef.current = window.setTimeout(() => {
            if (windowRef.current?.resizableElement.current) {
              windowRef.current.resizableElement.current.style.transition = '';
            }
            transitionClearanceRef.current = 0;
          }, 500);

          windowRef.current.updateSize({
            height: '300px',
            width: '300px',
          });

          windowRef.current.updatePosition({
            x: minimizedTargetRect.left,
            y: document.body.clientHeight,
          });
        }
        break;
    }
  }, [current.value, minimizedTargetRect.left, current.history]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch({
        type: 'focusWindow',
        payload: { name },
      });
    }
  }, [isFocused, dispatch, name]);

  const handleMinimizeClick = (e: Event) => {
    e.stopPropagation();
    dispatch({ type: 'minimizedWindow', payload: { name } });
    send('MINIMIZE');
  };
  const handleCloseClick = (e: Event) => {
    e.stopPropagation();
    dispatch({ type: 'removeWindow', payload: { name } });
  };
  const handleMaximizeClick = (e: Event) => {
    e.stopPropagation();
    if (!resizeable) return;
    send('MAXIMIZE');
    maximizeApp();
  };

  return (
    <Rnd
      ref={(c) => {
        if (c) windowRef.current = c;
      }}
      style={{
        cursor: 'auto !important',
        zIndex: appState?.zIndex ?? 0,
      }}
      dragHandleClassName="action-bar"
      minHeight={300}
      minWidth={300}
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
    >
      <span ref={ref}>
        <div onClick={focusWindow}>
          <StopLights
            variant={name}
            handleMinimizeClick={handleMinimizeClick}
            handleCloseClick={handleCloseClick}
            handleMaximizeClick={handleMaximizeClick}
          />
        </div>
        <Component key={name} />
      </span>
    </Rnd>
  );
});

export default Window;
