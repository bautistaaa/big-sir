import React, { FC } from 'react';
import styled from 'styled-components/macro';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isActive: boolean;
  className?: string;
  percentage?: number;
}
const Slider: FC<Props> = ({
  className,
  onChange,
  onMouseDown,
  isActive,
  min,
  max,
  percentage,
  step,
  value,
}) => {
  return (
    <Input
      className={className}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (onMouseDown) onMouseDown(e);
      }}
      onChange={onChange}
      type="range"
      min={min}
      max={max}
      value={value}
      percentage={percentage ?? ((value as number) ?? 0) * 100}
      step={step}
      isActive={isActive}
    />
  );
};

const Input = styled.input<{ isActive: boolean; percentage: number }>`
  background: ${({ percentage }) => `
    linear-gradient(
      to right,
      #b3b3b3 0%,
      #b3b3b3 ${percentage}%,
      #535353 ${percentage}%,
      #535353 100%
    )
  `};
  border: solid 1px black;
  border-radius: 8px;
  height: 7px;
  width: 100%;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #fff;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    opacity: 0;
  }

  ${({ isActive, percentage }) =>
    isActive &&
    `
    background: linear-gradient(
        to right,
        #1db954 0%,
        #1db954 ${percentage}%,
        #535353 ${percentage}%,
        #535353 100%
      );
    &::-webkit-slider-thumb {
      opacity: 1;
    }
  `}
`;

export default Slider;
