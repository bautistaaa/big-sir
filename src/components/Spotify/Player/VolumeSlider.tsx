import { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components/macro';

import Speaker from '../icons/Speaker';
import Slider from './Slider';

const VolumeSlider: FC<{
  volume: number;
  onChange(v: number): void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ volume, onChange, isMuted, setIsMuted }) => {
  const [isActive, setIsActive] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = +e.target.value;
    if (v === 0) {
      onChange(0.00001);
      setIsMuted(true);
    } else {
      onChange(+e.target.value);
      setIsMuted(false);
    }
  };
  const handleMuteButtonClick = () => {
    setIsMuted((val) => !val);
  };

  return (
    <Wrapper
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <MuteButton onClick={handleMuteButtonClick}>
        <Speaker
          isMuted={isMuted}
          fill={isActive ? '#fff' : '#b3b3b3'}
        ></Speaker>
      </MuteButton>
      <Slider
        onChange={handleChange}
        type="range"
        min={0}
        max={1}
        value={isMuted ? 0 : volume}
        step={0.01}
        isActive={isActive}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
const MuteButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  outline: none;
  cursor: pointer;
  border: none;
`;

export default VolumeSlider;
