import { FC, useRef } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import styled from 'styled-components/macro';
import { useAppContext } from './AppContext';
import useRect from './hooks/useRect';

const App: FC = () => {
  const { current } = useAppContext();
  const minimizedTargetRef = useRef(null);
  const minimizedTargetRect = useRect(minimizedTargetRef, []);

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
        <Dock minimizedTargetRef={minimizedTargetRef} />
      </Main>
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
