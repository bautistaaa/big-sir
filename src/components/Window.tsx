import { FC, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { CSSProperties } from 'styled-components/macro';
import { RectResult } from '../hooks/useRect';

const Window: FC<{
  width: number;
  height: number;
  minimizedTargetRect: RectResult;
  isWindowMinimized: boolean;
  zIndex: number | undefined;
  resizeable?: boolean;
}> = ({
  width,
  height,
  children,
  minimizedTargetRect,
  isWindowMinimized,
  zIndex,
  resizeable = true,
}) => {
  const [, setRefresh] = useState(0);
  const [previousPosition, setPreviousPosition] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >();
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: window.innerWidth / 2 - width / 2,
    y: window.innerHeight / 2 - height / 2,
  });
  const [overrideStyle, setOverrideStyle] = useState<
    CSSProperties | undefined
  >();
  const [test, setTest] = useState<CSSProperties | undefined>();

  useEffect(() => {
    if (isWindowMinimized) {
      setOverrideStyle({
        transition: 'transform .7s, opacity 0.5s',
      });
      setPosition((pos) => {
        setPreviousPosition(pos);
        return {
          x: minimizedTargetRect.left - minimizedTargetRect.width,
          y: window.innerHeight,
        };
      });
    } else {
      if (previousPosition) {
        setPosition(previousPosition);
      }
    }
  }, [isWindowMinimized]);
  useEffect(() => {
    setTest({
      height: `${height}px`,
      width: `${width}px`,
    });
  }, [height, width]);

  useEffect(() => {
    if (!isWindowMinimized) {
      const to = setTimeout(() => {
        setOverrideStyle(undefined);
      }, 700);

      return () => {
        clearTimeout(to);
      };
    }
  }, [isWindowMinimized]);

  const handleOnDragStop = (_: any, d: any) => {
    setRefresh((x) => x + 1);
    const { x, y } = d;
    setPosition({
      x,
      y,
    });
  };

  // export declare type RndResizeCallback = (e: MouseEvent | TouchEvent, dir: ResizeDirection, elementRef: HTMLElement, delta: ResizableDelta, position: Position) => void;
  // @ts-ignore
  const handleResizeStop = (...args) => {
    const [, , , , position] = args;
    setRefresh((x) => x + 1);
    const { x, y } = position;
    setPosition({
      x,
      y,
    });
  };

  return (
    <Rnd
      style={{
        cursor: 'auto !important',
        position: 'fixed',
        ...overrideStyle,
        ...test,
        zIndex,
      }}
      dragHandleClassName="action-bar"
      onDragStop={handleOnDragStop}
      onResizeStop={handleResizeStop}
      minHeight={300}
      minWidth={300}
      position={position}
      default={{
        ...position,
        width: `${width}px`,
        height: `${height}px`,
      }}
      enableResizing={resizeable}
    >
      {children}
    </Rnd>
  );
};

export default Window;
