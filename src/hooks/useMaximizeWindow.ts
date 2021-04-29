import { MutableRefObject, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { WindowPosition, WindowSize } from '../components/Window';
import extractPositionFromTransformStyle from '../utils/extractTransformStyles';

const TOP_BAR_HEIGHT = 25;
const DOCK_HEIGHT = 55;

const useMaximizeWindow = (
  windowRef: MutableRefObject<Rnd | undefined>,
  { height, width }: { height: number; width: number },
  send: any
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

  return () => {
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

    const { x: windowLeft, y: windowTop } = extractPositionFromTransformStyle(
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

    if (windowWidth === deskTopWidth && windowHeight === desktopHeight) {
      windowRef.current.updateSize(originalSizeRef.current);
      windowRef.current.updatePosition(originalPositionRef.current);
      send('FLOAT');
    } else {
      originalSizeRef.current = { width: windowWidth, height: windowHeight };
      originalPositionRef.current = { x: windowLeft, y: windowTop };

      windowRef.current.updateSize({
        height: desktopHeight,
        width: deskTopWidth,
      });

      windowRef.current.updatePosition({
        x: 0,
        y: 0,
      });
    }
  };
};

export default useMaximizeWindow;
