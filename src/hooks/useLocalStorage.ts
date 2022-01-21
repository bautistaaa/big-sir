import { useState } from 'react';
import { getWithExpiry } from '../components/Spotify/utils/getToken';

const ONE_HOUR = 60 * 60 * 1000;
const useLocalStorage = (
  key: string,
  initialValue?: string
): [string, (v: string) => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return getWithExpiry(key);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);

      const now = new Date();

      const item = {
        value: value,
        expiry: now.getTime() + ONE_HOUR,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
