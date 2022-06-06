import styled from 'styled-components/macro';
import { useAppContext } from './AppContext';
import { LoggedOutView } from './LoggedOutView';
import { LoggedInView } from './LoggedInView';
import { useActor } from '@xstate/react';

const App = () => {
  const service = useAppContext();
  const [current] = useActor(service);
  console.count('desktop');

  return (
    <Wrapper
      style={{
        background: `url('./bg-3.jpg') no-repeat center top fixed`,
        backgroundSize: 'cover',
        minHeight: '100%',
        height: '100%',
      }}
    >
      {current.matches('loggedOut') && <LoggedOutView />}
      {current.matches('loggedIn') && <LoggedInView />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default App;
