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

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref]);

  return isFocused;
}

export default useIsFocused;
