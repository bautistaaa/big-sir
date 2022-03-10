import { FC, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components/macro';
import { useAppContext } from '../AppContext';
import useIsFocused from '../hooks/useIsFocused';

export interface Icon {
  type: string;
  displayName: string;
  imageSrc: string;
  default: {
    x: number;
    y: number;
  };
}
export const ICONS: Icon[] = [
  {
    type: 'directory',
    displayName: 'personal',
    imageSrc: 'folder.png',
    default: {
      x: Math.round(window.innerWidth - 80),
      y: 10,
    },
  },
  {
    type: 'app',
    displayName: 'chrome',
    imageSrc: 'chrome.png',
    default: {
      x: Math.round(window.innerWidth - 80),
      y: 110,
    },
  },
  {
    type: 'app',
    displayName: 'terminal',
    imageSrc: 'terminal.png',
    default: {
      x: Math.round(window.innerWidth - 80),
      y: 210,
    },
  },
];

const DesktopIcon: FC<{
  icon: Icon;
  reset: boolean;
  activeIcon: string;
  setActiveIcon: React.Dispatch<React.SetStateAction<string>>;
}> = ({ icon, reset, activeIcon, setActiveIcon }) => {
  const { send } = useAppContext();
  const windowRef = useRef<Rnd>();
  const iconRef = useRef<HTMLDivElement | null>(null);
  const { isFocused } = useIsFocused(iconRef);

  useEffect(() => {
    if (!isFocused) {
      setActiveIcon('');
    } else {
      setActiveIcon(icon.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (reset) {
      windowRef.current?.updatePosition({
        x: icon.default.x,
        y: icon.default.y,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const handleDoubleClick = () => {
    if (icon.displayName === 'personal') {
      send({ type: 'FOCUS_WINDOW', payload: { name: 'finder' } });
    } else if (icon.displayName === 'terminal') {
      send({ type: 'FOCUS_WINDOW', payload: { name: 'terminal' } });
    } else if (icon.displayName === 'chrome') {
      send({ type: 'FOCUS_WINDOW', payload: { name: 'chrome' } });
    }
  };

  return (
    <Rnd
      ref={(c) => {
        if (c) windowRef.current = c;
      }}
      bounds=".bounds"
      enableResizing={false}
      style={{
        cursor: 'auto !important',
      }}
      default={{
        x: icon.default.x,
        y: icon.default.y,
        width: '74px',
        height: '88px',
      }}
      onDragStart={() => {
        setActiveIcon(icon.displayName);
      }}
    >
      <DesktopIconWrapper
        onDoubleClick={handleDoubleClick}
        active={activeIcon === icon.displayName}
        ref={iconRef}
      >
        <img src={icon.imageSrc} alt="" />
        <ItemName active={activeIcon === icon.displayName}>
          {icon.displayName}
        </ItemName>
      </DesktopIconWrapper>
    </Rnd>
  );
};

const DesktopIconWrapper = styled.div<{ active: boolean }>`
  cursor: default;
  text-align: center;
  display: inline-block;
  padding: 3px 7px 7px;
  ${({ active }) =>
    active &&
    `
    background: rgba(255,255,255, 0.1);
  `}
  img {
    pointer-events: none;
    width: 60px;
  }
`;
const ItemName = styled.span<{ active: boolean }>`
  color: white;
  font-size: 12px;
  word-break: break-all;
  ${({ active }) =>
    active &&
    `
    background: rgb(26, 109, 196) !important;
    border-radius: 4px;
    padding: 1px;
    -webkit-box-decoration-break: clone;
    box-shadow: rgb(26, 108, 196) 5px 0px 0px, rgb(26, 109, 196) -5px 0px 0px;
  `}
`;

export default DesktopIcon;
