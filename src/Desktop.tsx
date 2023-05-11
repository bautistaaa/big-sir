import styled from 'styled-components';
import { useAppContext } from './AppContext';
import { LoggedOutView } from './LoggedOutView';
import { LoggedInView } from './LoggedInView';
import { useActor } from '@xstate/react';
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

const App = () => {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const service = useAppContext();
  const [current, send] = useActor(service);

  useEffect(() => {
    if (params.get('app')) {
      send({ type: 'LOGIN' });
    } else {
      send({ type: 'LOGOUT' });
    }
  }, [params, send]);

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
