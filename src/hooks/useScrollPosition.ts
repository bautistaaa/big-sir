import { useEffect, useState, useRef } from 'react';

const useScrollPosition = (node: HTMLElement | null) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!node) return;

    const updatePosition = (e: any) => {
      setScrollPosition(e.target.scrollTop);
    };
    node.addEventListener('scroll', updatePosition);
    return () => node.removeEventListener('scroll', updatePosition);
  }, [node]);

  return scrollPosition;
};

export default useScrollPosition;
