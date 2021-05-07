import { FC, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import styled from 'styled-components/macro';
import { useAppContext } from './AppContext';
import useRect from './hooks/useRect';
import useContextMenu from './hooks/useContextMenu';
import DesktopIcon, { ICONS } from './components/DesktopIcon';

const App: FC = () => {
  const { current } = useAppContext();
  const minimizedTargetRef = useRef(null);
  const [reset, setReset] = useState(false);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);
  const { xPos, yPos, showMenu } = useContextMenu();
  const [activeIcon, setIsActiveIcon] = useState('');

  const handleCleanUpClick = () => {
    setReset(true);
    setTimeout(() => {
      setReset(false);
    }, 0);
  };

  return (
    <Wrapper>
      <TopBar />
      <Main className="bounds">
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
        <Dock minimizedTargetRef={minimizedTargetRef} />
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
  min-height: 100%;
  height: 100%;
  background: url('./bg-3.jpg') no-repeat center top fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Main = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;
export default App;
