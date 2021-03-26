import { FC, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { CSSProperties } from 'styled-components/macro';
import { RectResult } from '../hooks/useRect';

const Window: FC<{
  width: number;
  height: number;
  minimizedTargetRect: RectResult;
  isWindowMinimized: boolean;
}> = ({
  width,
  height,
  children,
  minimizedTargetRect,
  isWindowMinimized,
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

  return (
    <Rnd
      style={{ position: 'fixed', ...overrideStyle }}
      onDragStop={handleOnDragStop}
      minHeight={300}
      minWidth={300}
      position={position}
      default={{
        ...position,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </Rnd>
  );
};

export default Window;
