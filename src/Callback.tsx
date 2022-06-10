import { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import { parseAccessToken } from './utils';

const Callback = () => {
  const location = useLocation();
  const [token, setToken] = useLocalStorage('token', '');
  useEffect(() => {
    const accessToken = parseAccessToken(location.hash);
    if (accessToken) {
      setToken(accessToken);
    }
  }, [location, setToken]);
  if (token) {
    return <Redirect to="/?app=spotify" />;
  }
  return <div />;
};

export default Callback;
