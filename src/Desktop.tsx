import { FC, useEffect, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import styled from 'styled-components';
import { useAppContext } from './AppContext';
import useRect from './hooks/useRect';
import useContextMenu from './hooks/useContextMenu';
import DesktopIcon, { ICONS } from './components/DesktopIcon';

const App: FC = () => {
  const { current, send } = useAppContext();
  const minimizedTargetRef = useRef(null);
  const [reset, setReset] = useState(false);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);
  const { xPos, yPos, showMenu } = useContextMenu();
  const [activeIcon, setIsActiveIcon] = useState('');
  console.count('desktop');
  const handleCleanUpClick = () => {
    setReset(true);
  };

  useEffect(() => {
    if (reset === true) {
      setReset(false);
    }
  }, [reset]);

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

  return (
    <Wrapper
      style={{
        background: `url('./bg-3.jpg') no-repeat center top fixed`,
        backgroundSize: 'cover',
        minHeight: '100%',
        height: '100%',
      }}
    >
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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const Top = styled.div`
  flex: 1;
`;
const Bottom = styled.div`
  height: 55px;
`;

export default App;
