import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useService } from '@xstate/react';

import { useSpotifyContext } from '../SpotifyContext';
import { Context, SpotifyEvent } from '../spotify.machine';

interface Props {
  backgroundColor: string;
  text: string;
}
const useTransitionHeader = ({ backgroundColor, text }: Props) => {
  const service = useSpotifyContext();
  const [, send] = useService<Context, SpotifyEvent>(service);

  const { ref, entry } = useInView({
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  });

  useEffect(() => {
    const diff = 1 - (entry?.intersectionRatio ?? 0);

    send({
      type: 'TRANSITION_HEADER',
      payload: {
        backgroundColor,
        opacity: diff > 0.9 ? 1 : diff,
        text,
      },
    });
  }, [entry?.intersectionRatio, send, text, backgroundColor]);

  return ref;
};

export default useTransitionHeader;
