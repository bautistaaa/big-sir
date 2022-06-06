import { useEffect, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';

import DesktopIcon, { ICONS } from './components/DesktopIcon';
import useRect from './hooks/useRect';
import useContextMenu from './hooks/useContextMenu';
import styled from 'styled-components';
import { useAppContext } from './AppContext';
import { useActor } from '@xstate/react';

export const LoggedInView = () => {
  const service = useAppContext();
  const [current, send] = useActor(service);
  const minimizedTargetRef = useRef(null);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);
  const { xPos, yPos, showMenu } = useContextMenu();
  const [activeIcon, setIsActiveIcon] = useState('');
  const [reset, setReset] = useState(false);

  console.count('desktop');

  useEffect(() => {
    const handler = (e: any) => {
      if (e.matches) {
        send({ type: 'TOGGLE_MODE', payload: { mode: 'dark' } });
      } else {
        send({ type: 'TOGGLE_MODE', payload: { mode: 'light' } });
      }
    };
    const mm = window.matchMedia('(prefers-color-scheme: dark)');
    mm.addEventListener('change', handler);

    return () => mm.removeEventListener('change', handler);
  }, [send]);

  const handleCleanUpClick = () => {
    setReset(true);
  };

  useEffect(() => {
    if (reset === true) {
      setReset(false);
    }
  }, [reset]);
  return (
    <>
      <TopBar />
      <Main>
        <InnerWrapper>
          <Top className="bounds">
            {current.context.activeWindows.map((aw) => (
              <Window
                key={aw.name}
                name={aw.name}
                minimizedTargetRect={minimizedTargetRect}
              />
            ))}
            {ICONS.map((icon) => {
              return (
                <DesktopIcon
                  key={icon.displayName}
                  icon={icon}
                  reset={reset}
                  activeIcon={activeIcon}
                  setActiveIcon={setIsActiveIcon}
                />
              );
            })}
          </Top>
          <Bottom>
            <Dock minimizedTargetRef={minimizedTargetRef} />
          </Bottom>
        </InnerWrapper>
      </Main>
      {showMenu && (
        <ContextMenu
          xPos={xPos}
          yPos={yPos}
          handleCleanUpClick={handleCleanUpClick}
        />
      )}
    </>
  );
};

const Top = styled.div`
  flex: 1;
`;
const Bottom = styled.div`
  height: 55px;
`;
const Main = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;
const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;
