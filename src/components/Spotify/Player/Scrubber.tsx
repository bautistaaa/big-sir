import { ChangeEvent, FC, MutableRefObject, useState } from 'react';
import styled from 'styled-components/macro';
import { convertMsToMinutesAndSeconds } from '../../../utils';

import Slider from './Slider';

interface Props {
  playerRef: MutableRefObject<Spotify.Player | null>;
  playerState: Spotify.PlaybackState;
}
const Scrubber: FC<Props> = ({ playerRef, playerState }) => {
  const [isActive, setIsActive] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = +e.target.value;
  };
  return (
    <Wrapper
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <TrackProgress>
        {convertMsToMinutesAndSeconds(playerState.position)}
      </TrackProgress>
      <TrackScrubber>
        <Slider
          onChange={handleChange}
          type="range"
          min={0}
          max={playerState.duration}
          value={playerState.position}
          percentage={(playerState.position / playerState.duration) * 100}
          step={0.01}
          isActive={isActive}
        />
      </TrackScrubber>
      <TrackDuration>
        {convertMsToMinutesAndSeconds(playerState.duration)}
      </TrackDuration>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;
const TimeDisplay = styled.div`
  font-size: 11px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 16px;
  text-transform: none;
  min-width: 40px;
  text-align: center;
  color: #b3b3b3;
`;
const TrackProgress = styled(TimeDisplay)``;
const TrackScrubber = styled.div`
  height: 12px;
  position: relative;
  width: 100%;
`;
const TrackDuration = styled(TimeDisplay)``;

export default Scrubber;
