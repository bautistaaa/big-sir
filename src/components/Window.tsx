import { FC, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import styled, { CSSProperties } from 'styled-components/macro';
import useRect, { RectResult } from '../hooks/useRect';
import { RED, YELLOW, GREEN } from '../shared/constants';

const Window: FC<{
  width: number;
  height: number;
  minimizedTargetRect: RectResult;
  isWindowMinimized: boolean;
  setIsWindowMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  width,
  height,
  children,
  minimizedTargetRect,
  isWindowMinimized,
  setIsWindowMinimized,
}) => {
  const finderRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
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
  const finderRect = useRect(finderRef, [refresh]);

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

  useEffect(() => {}, [minimizedTargetRect, finderRect]);

  const handleMinimizeClick = () => {
    setIsWindowMinimized(true);
  };
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
      position={position}
      default={{
        ...position,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Wrapper isWindowMinimized={isWindowMinimized} ref={finderRef}>
        <ActionBar>
          <CloseButton />
          <MinimizeButton onClick={handleMinimizeClick} />
          <FullScreenButton />
        </ActionBar>
        <>{children}</>
      </Wrapper>
    </Rnd>
  );
};

const Wrapper = styled.div<{ isWindowMinimized: boolean }>`
  ${({ isWindowMinimized }) =>
    isWindowMinimized
      ? `transform: scale(0.2); opacity: 0;`
      : `transform: scale(1); opacity: 1;`}
  transition: transform .7s, opacity .4s;
  transform-origin: top left;
  width: 100%;
  height: 100%;
`;
const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  height: 22px;
  padding: 7px;
  background: rgb(56, 56, 56);
`;
const BaseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  & + & {
    margin-left: 5px;
  }
`;
const CloseButton = styled(BaseButton)`
  background: ${RED};
`;
const MinimizeButton = styled(BaseButton)`
  background: ${YELLOW};
`;
const FullScreenButton = styled(BaseButton)`
  background: ${GREEN};
`;
export default Window;
