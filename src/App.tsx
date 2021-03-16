import { FC } from 'react';
import Dock from './components/Dock';
import Terminal from './components/Terminal';
import styled from 'styled-components/macro';

const App: FC = () => {
  return (
    <Wrapper>
      <Overlay />
      <TerminalWrapper>
        <Terminal />
      </TerminalWrapper>
      <DockWrapper>
        <Dock />
      </DockWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: url('./sasuke.png') no-repeat center top fixed;
  background-size: cover;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
`;
const TerminalWrapper = styled.div`
  position: absolute;
  bottom: 40%;
  left: 30%;
`;
const DockWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
`;
export default App;
