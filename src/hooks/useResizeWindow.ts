import { MutableRefObject, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Event, SingleOrArray, SCXML, EventData, State } from 'xstate';
import { WindowPosition, WindowSize } from '../components/Window';
import { WindowEvent } from '../components/Window/window.machine';
import extractPositionFromTransformStyle from '../utils/extractTransformStyles';
import { RectResult } from './useRect';

const TOP_BAR_HEIGHT = 25;
const DOCK_HEIGHT = 55;

const useResizeWindow = (
  current: any,
  send: (
    event: SingleOrArray<Event<WindowEvent>> | SCXML.Event<WindowEvent>,
    payload?: EventData | undefined
  ) => State<any, WindowEvent, any, any>,
  { height, width }: { height: number; width: number },
  windowRef: MutableRefObject<Rnd | undefined>,
  minimizedTargetRect: RectResult
) => {
  const originalPositionRef = useRef<WindowPosition>({
    x: window.innerWidth / 2 - width / 2,
    y: window.innerHeight / 2 - height / 2,
  });
  const originalSizeRef = useRef<WindowSize>({
    height,
    width,
  });

  const transitionClearanceRef = useRef<number>();
  useEffect(() => {
    switch (current.value) {
      case 'floating':
        if (
          current.history?.matches('minimized') ||
          current.history?.matches('maximized')
        ) {
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
      case 'maximized':
        if (!windowRef?.current?.resizableElement?.current) {
          return;
        }
        const desktopHeight =
          document.body.clientHeight - DOCK_HEIGHT - TOP_BAR_HEIGHT;
        const deskTopWidth = document.body.clientWidth;

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

        windowRef.current.resizableElement.current.style.transition =
          'height 0.5s, width 0.5s, transform 0.5s';

        clearTimeout(transitionClearanceRef.current);

        transitionClearanceRef.current = window.setTimeout(() => {
          if (windowRef.current?.resizableElement.current) {
            windowRef.current.resizableElement.current.style.transition = '';
          }
          transitionClearanceRef.current = 0;
        }, 500);

        originalSizeRef.current = {
          width: windowWidth,
          height: windowHeight,
        };
        originalPositionRef.current = { x: windowLeft, y: windowTop };

        windowRef.current.updateSize({
          height: desktopHeight,
          width: deskTopWidth,
        });

        windowRef.current.updatePosition({
          x: 0,
          y: 0,
        });

        break;
    }
  }, [windowRef, current.value, minimizedTargetRect.left, current.history]);
};

export default useResizeWindow;
