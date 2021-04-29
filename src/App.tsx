import { FC, useRef } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import styled from 'styled-components/macro';
import { useAppContext } from './AppContext';
import useRect from './hooks/useRect';

const App: FC = () => {
  const { state } = useAppContext();

  const minimizedTargetRef = useRef(null);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);

  return (
    <Wrapper>
      <TopBar />

      <>
        {state.activeWindows.map((aw) => (
          <Window
            key={aw.name}
            name={aw.name}
            minimizedTargetRect={minimizedTargetRect}
          />
        ))}
      </>

      <Dock minimizedTargetRef={minimizedTargetRef} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  background: url('./bg-3.jpg') no-repeat center top fixed;
  background-size: cover;
`;
export default App;
