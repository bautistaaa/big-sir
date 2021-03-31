import { MutableRefObject, useEffect, useState } from 'react';
function useIsFocused(ref: MutableRefObject<HTMLDivElement | null>) {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    window.addEventListener('mousedown', listener);
    window.addEventListener('touchstart', listener);

    return () => {
      window.removeEventListener('mousedown', listener);
      window.removeEventListener('touchstart', listener);
    };
  }, [ref]);

  return isFocused;
}

export default useIsFocused;
