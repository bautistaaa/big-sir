import { useEffect } from 'react';
import { observe, IntersectionOptions } from 'react-intersection-observer';

interface Props {
  dep: unknown;
  callback(v: boolean): void;
  options: IntersectionOptions;
  shouldDestroy: boolean;
}

/**
 * This is really specific to the playlist views
 * So I don't feel like passing in everything
 */
const useLoadMore = ({ dep, callback, options, shouldDestroy }: Props) => {
  useEffect(() => {
    const el = document.getElementById('main');

    if (el) {
      const loadMoreEl = document.getElementById('load-more');
      if (!loadMoreEl) return;

      const destroy = observe(
        loadMoreEl,
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
  }, [dep, callback, options, shouldDestroy]);
};

export default useLoadMore;
