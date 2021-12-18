import { useEffect } from 'react';
import { observe, IntersectionOptions } from 'react-intersection-observer';

interface Props {
  deps: unknown[];
  callback(v: boolean): void;
  options: IntersectionOptions;
  shouldDestroy: boolean;
}

/**
 * This is really specific to the playlist views
 * So I don't feel like passing in everything
 */
const useLoadMore = ({ deps, callback, options, shouldDestroy }: Props) => {
  useEffect(() => {
    const el = document.getElementById('main');

    if (el) {
      const destroy = observe(
        document.getElementById('load-more')!,
        callback,
        options
      );

      if (shouldDestroy) {
        destroy();
      }

      return () => {
        destroy();
      };
    }
  }, deps);
};

export default useLoadMore;
